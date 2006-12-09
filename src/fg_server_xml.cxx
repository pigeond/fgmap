
#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <errno.h>

#include <simgear/math/SGMath.hxx>


#define QS          "QUERY_STRING"

#define HTTP_HEADER "Pragma: no-cache\r\nCache-Control: no-cache\r\nExpires: Sat, 17 Sep 1977 00:00:00 GMT\r\nContent-Type: text/xml\r\n\r\n"


/* From FG */
#define MAX_CALLSIGN_LEN        8
#define MAX_MODEL_NAME_LEN      96



#if 1
static void
euler_get(float lat, float lon, float ox, float oy, float oz,
        float *heading, float *pitch, float *roll)
{
    /* FGMultiplayMgr::ProcessPosMsg */

    SGVec3f angleAxis;
    angleAxis(0) = ox;
    angleAxis(1) = oy;
    angleAxis(2) = oz;

    SGQuatf ecOrient;
    ecOrient = SGQuatf::fromAngleAxis(angleAxis);

    /* FGAIMultiplayer::update */

    float lat_rad, lon_rad;
    lat_rad = lat * SGD_DEGREES_TO_RADIANS;
    lon_rad = lon * SGD_DEGREES_TO_RADIANS;

    SGQuatf qEc2Hl = SGQuatf::fromLonLatRad(lon_rad, lat_rad);

    SGQuatf hlOr = conj(qEc2Hl) * ecOrient;

    float hDeg, pDeg, rDeg;
    hlOr.getEulerDeg(hDeg, pDeg, rDeg);

    if(heading)
        *heading = hDeg;
    if(pitch)
        *pitch = pDeg;
    if(roll)
        *roll = rDeg;

}
#else
static void
euler_get(float x, float y, float z, float ox, float oy, float oz,
        float *heading, float *pitch, float *roll)
{
    /* FGMultiplayMgr::ProcessPosMsg */

    SGVec3d ecPos;
    ecPos(0) = x;
    ecPos(1) = y;
    ecPos(2) = z;

    SGVec3f angleAxis;
    angleAxis(0) = ox;
    angleAxis(1) = oy;
    angleAxis(2) = oz;

    SGQuatf ecOrient;
    ecOrient = SGQuatf::fromAngleAxis(angleAxis);


    /* FGAIMultiplayer::update */

    SGGeod pos = SGGeod::fromCart(ecPos);

    SGQuatf qEc2Hl = SGQuatf::fromLonLatRad((float) pos.getLongitudeRad(),
            (float) pos.getLatitudeRad());

    SGQuatf hlOr = conj(qEc2Hl) * ecOrient;

    float hDeg, pDeg, rDeg;
    hlOr.getEulerDeg(hDeg, pDeg, rDeg);

    if(heading)
        *heading = hDeg;
    if(pitch)
        *pitch = pDeg;
    if(roll)
        *roll = rDeg;

}
#endif


int
main(int argc, char **argv)
{
    char *qs = NULL;
    char host[256];
    int port = 0;
    int fd = -1;
    FILE *f;

    struct hostent *h;
    struct in_addr ia;
    struct sockaddr_in sin;

    char buf[256];

    int npilots = 0;

    char callsign[MAX_CALLSIGN_LEN];
    char model[MAX_MODEL_NAME_LEN];
    char server_ip[16];
    float x, y, z;
    float lat, lon, alt;
    float ox, oy, oz;
    float heading, pitch, roll;


    if((qs = getenv(QS)) == NULL)
    {
        return -1;
    }

    if(sscanf(qs, "%255[^:]:%d", host, &port) != 2)
    {
        return -1;
    }

    host[255] = '\0';

    if(!host || strlen(host) == 0)
    {
        return -1;
    }

    if(port <= 0)
    {
        return -1;
    }

    h = gethostbyname(host);

    if(h == NULL)
    {
        return -1;
    }
    
    errno = 0;
    fd = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP);

    if(fd < 0)
    {
        return -1;
    }


    memcpy(&ia, h->h_addr_list[0], h->h_length);
    sin.sin_family = AF_INET;
    sin.sin_addr = ia;
    sin.sin_port = htons(port);

    if(connect(fd, (struct sockaddr *) &sin, sizeof(sin)) < 0)
    {
        close(fd);
        return -1;
    }

    f = fdopen(fd, "r");

    printf("%s", HTTP_HEADER);

    while(!feof(f))
    {
        int s;

        if(fgets(buf, sizeof(buf), f) == NULL)
        {
            break;
        }

        strtok(buf, "\n");

        if(buf[0] == '#')
        {
            if(sscanf(buf, "# %d pilots(s) online", &npilots) == 1)
            {
                printf("<fg_server pilot_cnt=\"%d\">\n", npilots);
            }
        }
        else if((s = sscanf(buf, "%[^@]@%[^:]: %f %f %f %f %f %f %f %f %f %s",
                    callsign, server_ip,
                    &x, &y, &z,
                    &lat, &lon, &alt,
                    &ox, &oy, &oz,
                    model) == 12))
        {
            char *model_file = NULL;

            //euler_get(x, y, z, ox, oy, oz, &heading, &roll, &pitch);
            euler_get(lat, lon, ox, oy, oz, &heading, &roll, &pitch);

            /* Get the filename part from the model path */
            if((model_file = rindex(model, '/')))
            {
                model_file += 1;
                if(*model_file)
                {
                    strtok(model_file, ".");
                }
            }

            printf("\t<marker server_ip=\"%s\" callsign=\"%s\" lat=\"%f\" lng=\"%f\" alt=\"%f\" heading=\"%f\" pitch=\"%f\" roll=\"%f\" model=\"%s\" />\n",
                    server_ip, callsign,
                    lat, lon, alt,
                    heading, roll, pitch,
                    model_file);
        }
        /*
        else
        {
            fprintf(stderr, "buf[%s][%d]\n", buf, s);
        }
        */
    }

    printf("</fg_server>\n\n");

    close(fd);

    return 0;
}

