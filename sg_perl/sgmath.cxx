
#include <simgear/math/SGMath.hxx>

void euler_get(float lat, float lon, float ox, float oy, float oz,
    float *head, float *pitch, float *roll)
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

    if(head)
        *head = hDeg;
    if(pitch)
        *pitch = pDeg;
    if(roll)
        *roll = rDeg;
}

