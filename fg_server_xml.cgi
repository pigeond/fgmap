#!/usr/bin/perl -wT


# fg_server_xml.cgi: for FGMap
# fg_server_kml.cgi: initial request from GE
# fg_server_kml.cgi and callsigns=: update request from GE
#
# TODO: callsigns is semicolon seperated, can be easily broken

use strict;
use IO::Socket;
use lib "./sg_perl/blib/lib";
use lib "./sg_perl/blib/arch/auto/sgmath";
use sgmath;


my($HTTP_HOST, $SCRIPT_NAME, $QUERY_STRING, $DOCUMENT_PATH);
my($server) = "localhost";
my($port) = 5001;
my($in_callsigns);
my(@last_callsigns);
my(@this_callsigns);

my($output) = "";
my($l);
my(%ocs);



# XML output, for FGMap

my($XML_HEADER) = <<XML;
Pragma: no-cache
Cache-Control: no-cache
Expires: Sat, 17 Sep 1977 00:00:00 GMT
Content-Type: text/xml

XML

sub do_xml_header
{
    my($cnt) = @_;
    return ${XML_HEADER}."<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<fg_server pilot_cnt=\"${cnt}\">\n";
}

sub do_xml_single
{
    my($callsign, $server_ip, $model, $lat, $lon, $alt, $head, $pitch, $roll) =
        @_;
    return <<XML;
    <marker callsign="${callsign}" server_ip="${server_ip}" model="${model}" lat="${lat}" lng="${lon}" alt="${alt}" heading="${head}" pitch="${pitch}" roll="${roll}" />
XML
}

sub do_xml_tail
{
    return "</fg_server>\n\n";
}

my(%xml_output) =
(
    'header' => \&do_xml_header,
    'single' => \&do_xml_single,
    'tail' => \&do_xml_tail,
);


######

my($KML_HEADER) = <<KML;
Pragma: no-cache
Cache-Control: no-cache
Expires: Sat, 17 Sep 1977 00:00:00 GMT
Content-Type: application/vnd.google-earth.kml+xml

KML

my($DAE_SCALE) = "150.0";
my($KML_REFRESH_INTERVAL) = "5";

sub kml_model_url_get
{
    my($model) = @_;
    my(@GE_MODELS) = ( 'c172p', 'ufo', '737-300', );
    if(!grep(/^${model}$/, @GE_MODELS))
    {
        $model = $GE_MODELS[0];
    }
    return "http://${HTTP_HOST}/${DOCUMENT_PATH}/ge/daes/${model}/${model}.dae";
}


# KML (initial) output, for Google Earth
sub do_kml_header
{
    my($kml) = <<KML;
<?xml version="1.0" encoding="UTF-8" ?>
<kml xmlns="http://earth.google.com/kml/2.0">
<Document id="mpmap">
<name>FlightGear MP server map</name>
<visibility>1</visibility>
KML
    return ${KML_HEADER}.${kml};

}

sub do_kml_single
{
    my($callsign, $server_ip, $model, $lat, $lon, $alt, $head, $pitch, $roll) =
        @_;

    push(@this_callsigns, $callsign);

    # simple feet to meter
    $alt *= 0.3048;

    my($model_url) = &kml_model_url_get($model);

    return <<KML;
    <Placemark id="${callsign}">
        <name>${callsign}</name>
        <description>${callsign}: ${model}</description>
        <Model>
            <altitudeMode>absolute</altitudeMode>
            <Location>
                <latitude>${lat}</latitude>
                <longitude>${lon}</longitude>
                <altitude>${alt}</altitude>
            </Location>
            <Orientation>
                <heading>${head}</heading>
                <tilt>${pitch}</tilt>
                <roll>${roll}</roll>
            </Orientation>
            <Scale>
                <x>${DAE_SCALE}</x>
                <y>${DAE_SCALE}</y>
                <z>${DAE_SCALE}</z>
            </Scale>
            <Link>
                <href>${model_url}</href>
                <refreshMode>onChange</refreshMode>
            </Link>
        </Model>
    </Placemark>

KML
}

sub do_kml_tail
{
    my($callsigns_str) = join(';', @this_callsigns);
    return <<KML;
    <NetworkLink id="fgmap_update">
        <name>Update</name>
        <Link>
            <href>http://${HTTP_HOST}/${DOCUMENT_PATH}/fg_server_kml.cgi?${server}:${port}&amp;callsigns=${callsigns_str}</href>
            <refreshMode>onInterval</refreshMode>
            <refreshInterval>${KML_REFRESH_INTERVAL}</refreshInterval>
        </Link>
    </NetworkLink>
</Document>
</kml>
KML
}

my(%kml_normal_output) =
(
    'header' => \&do_kml_header,
    'single' => \&do_kml_single,
    'tail' => \&do_kml_tail,
);


# KML (update) output, for Google Earth
sub do_kml_update_header
{
    my($kml) = <<KML;
<?xml version="1.0" encoding="UTF-8" ?>
<kml xmlns="http://earth.google.com/kml/2.0">
<NetworkLinkControl>
<Update>
    <targetHref>http://${HTTP_HOST}/${DOCUMENT_PATH}/fg_server_kml.cgi?${server}:${port}</targetHref>
KML
    return ${KML_HEADER}.${kml};
}

sub do_kml_update_single
{
    my($callsign, $server_ip, $model, $lat, $lon, $alt, $head, $pitch, $roll) =
        @_;

    # simple feet to meter
    $alt *= 0.3048;

    my($model_url) = &kml_model_url_get($model);

    push(@this_callsigns, $callsign);

    if(grep(/^${callsign}$/, @last_callsigns))
    {
        # We have it before, <Change> it

        return <<KML;
    <Change>
        <Placemark targetId="${callsign}">
            <Model>
                <Location>
                    <latitude>${lat}</latitude>
                    <longitude>${lon}</longitude>
                    <altitude>${alt}</altitude>
                </Location>
                <Orientation>
                    <heading>${head}</heading>
                    <tilt>${pitch}</tilt>
                    <roll>${roll}</roll>
                </Orientation>
            </Model>
        </Placemark>
    </Change>
KML
    }
    else
    {
        # New one, <Create> it
        return <<KML;
    <Create>
        <Document targetId="mpmap">
            <Placemark id="${callsign}">
                <name>${callsign}</name>
                <description>${callsign}: ${model}</description>
                <Model>
                    <altitudeMode>absolute</altitudeMode>
                    <Location>
                        <latitude>${lat}</latitude>
                        <longitude>${lon}</longitude>
                        <altitude>${alt}</altitude>
                    </Location>
                    <Orientation>
                        <heading>${head}</heading>
                        <tilt>${pitch}</tilt>
                        <roll>${roll}</roll>
                    </Orientation>
                    <Scale>
                        <x>${DAE_SCALE}</x>
                        <y>${DAE_SCALE}</y>
                        <z>${DAE_SCALE}</z>
                    </Scale>
                    <Link>
                        <href>${model_url}</href>
                        <refreshMode>onChange</refreshMode>
                    </Link>
                </Model>
            </Placemark>
        </Document>
    </Create>
KML
    }
}

sub do_kml_update_tail
{
    my($callsign);
    my($kml);
    my($callsigns_str) = join(';', @this_callsigns);

    foreach $callsign (@last_callsigns)
    {
        if(!grep(/^${callsign}$/, @this_callsigns))
        {
            $kml .= <<KML;
    <Delete>
        <Placemark targetId="${callsign}" />
    </Delete>
KML
        }
    }

    $kml .= <<KML;
    <Change>
        <NetworkLink targetId="fgmap_update">
            <Link>
                <href>http://${HTTP_HOST}/${DOCUMENT_PATH}/fg_server_kml.cgi?${server}:${port}&amp;callsigns=${callsigns_str}</href>
            </Link>
        </NetworkLink>
    </Change>
</Update>
</NetworkLinkControl>
</kml>
KML
}

my(%kml_update_output) =
(
    'header' => \&do_kml_update_header,
    'single' => \&do_kml_update_single,
    'tail' => \&do_kml_update_tail,
);



sub escape_strs
{
    my($str) = @_;
    $str =~ s/"/\&quot;/g;
    $str =~ s/'/\&apos;/g;
    $str =~ s/\&/\&amp;/g;
    $str =~ s/>/\&gt;/g;
    $str =~ s/</\&lt;/g;
    return $str;
}



# Main starts here


$HTTP_HOST = $ENV{'HTTP_HOST'};
$QUERY_STRING = $ENV{'QUERY_STRING'};
$SCRIPT_NAME = $ENV{'SCRIPT_NAME'};

if(!defined(${HTTP_HOST}) ||
        !defined(${QUERY_STRING}) ||
        !defined(${SCRIPT_NAME}))
{
    exit(-1);
}

($DOCUMENT_PATH) = (${SCRIPT_NAME} =~ /^\/*(.*)\/.*?$/);

($server, $port, $in_callsigns) =
    (${QUERY_STRING} =~ m#(.*?):(\d+)&?(.*)#);

if(!defined($server) || !(defined($port)))
{
    exit(-1);
}

$server =~ s#></\\&\?\|\!\*##g;
$port =~ s#></\\&\?\|\!\*##g;

if($port <= 0 || $port >= 65536)
{
    exit(-1);
}


if($0 =~ m/fg_server_kml.cgi$/)
{
    if($in_callsigns =~ m/^callsigns=(.*)$/)
    {
        $in_callsigns = $1;
        @last_callsigns = split(/;/, $in_callsigns);
        %ocs = %kml_update_output;
    }
    else
    {
        %ocs = %kml_normal_output;
    }
}
else
{
    %ocs = %xml_output;
}


sub do_socket
{
    my($ret) = "";
    my($pilot_total) = 0;
    my($pilot_cnt) = 0;

    my($socket) = IO::Socket::INET->new(PeerAddr => $server,
                                        PeerPort => $port,
                                        Proto => "tcp",
                                        Type => SOCK_STREAM,
                                        Timeout => 10);

    if($socket)
    {
        while($l = <$socket>)
        {
            chomp($l);

            if((substr($l, 0, 1) eq "#") && ($l =~ /^# (\d+) .*? online/))
            {
                $pilot_total = $1;
                $ret .= $ocs{'header'}->($pilot_total);
            }
            #elsif($l =~ m/^(.*)@(.*?): (-?[0-9]+\.[0-9]+) (-?[0-9]+\.[0-9]+) (-?[0-9]+\.[0-9]+) (-?[0-9]+\.[0-9]+) (-?[0-9]+\.[0-9]+) (-?[0-9]+\.[0-9]+) (-?[0-9]+\.[0-9]+) (-?[0-9]+\.[0-9]+) (-?[0-9]+\.[0-9]+) (.*?)$/)
            elsif($l =~ m/^(.*)@(.*?): (-?[0-9\.]+) (-?[0-9\.]+) (-?[0-9\.]+) (-?[0-9\.]+) (-?[0-9\.]+) (-?[0-9\.]+) (-?[0-9\.]+) (-?[0-9\.]+) (-?[0-9\.]+) (.*?)$/)
            {
                my($callsign, $server_ip,
                        $x, $y, $z,
                        $lat, $lon, $alt,
                        $ox, $oy, $oz,
                        $model) =
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);

                $callsign = &escape_strs(${callsign});

                $callsign =~ s/^# //g;

                if($callsign and $model)
                {
                    #$model =~ s#.*/(.*?)\..*?$#$1#;
                    $model =~ s#.*/(.*?)#$1#;
                    $model =~ s/\..*?$//;

                    my($head, $pitch, $roll) = &sgmath::euler_get($lat, $lon,
                            $ox, $oy, $oz);

                    $ret .= $ocs{'single'}->($callsign, $server_ip, $model,
                            $lat, $lon, $alt,
                            $head, $pitch, $roll);

                    $pilot_cnt++;

                    if($pilot_cnt >= $pilot_total)
                    {
                        close($socket);
                        undef($socket);
                        last;
                    }
                }
            }

        }

        $ret .= $ocs{'tail'}->();

        if($socket)
        {
            close($socket);
        }
    }
    else
    {
        $ret .= $ocs{'header'}->(0);
        $ret .= $ocs{'tail'}->();
    }

    return $ret;
}


sub do_testing
{
    my($ret) = "";

    my($default_lat) = 37.613545;
    my($default_lon) = -122.357237;

    my(@test_pilots) = (
        {   callsign => 'pilot1',
            model => 'model1',
            server_ip => '127.0.0.1',
            lat => $default_lat,
            lon => $default_lon,
            alt => 0,
            head => 0, pitch => 0, roll => 0,
        },
        {   callsign => 'pilot2',
            model => 'model2',
            server_ip => '127.0.0.1',
            lat => $default_lat + 0.01,
            lon => $default_lon + 0.01,
            alt => 0,
            head => 90, pitch => 0, roll => 0,
        },
        {   callsign => 'pilot3',
            model => 'model3',
            server_ip => '127.0.0.1',
            lat => $default_lat + 0.02,
            lon => $default_lon + 0.02,
            alt => 0,
            head => 45, pitch => 0, roll => 0,
        },
        {   callsign => 'pilot4',
            model => 'model4',
            server_ip => '127.0.0.1',
            lat => $default_lat + 0.03,
            lon => $default_lon + 0.03,
            alt => 0,
            head => 180, pitch => 0, roll => 0,
        },
        {   callsign => 'pilot5',
            model => 'model5',
            server_ip => '127.0.0.1',
            lat => $default_lat + 0.04,
            lon => $default_lon + 0.04,
            alt => 0,
            head => 270, pitch => 0, roll => 0,
        },
    );

    my($pilot_total) = $#test_pilots;

    $ret .= $ocs{'header'}->($pilot_total);

    foreach my $p (@test_pilots)
    {
        $ret .= $ocs{'single'}->($p->{'callsign'},
                $p->{'server_ip'},
                $p->{'model'},
                $p->{'lat'}, $p->{'lon'}, $p->{'alt'},
                $p->{'head'}, $p->{'pitch'}, $p->{'roll'});
    }

    $ret .= $ocs{'tail'}->();

    return $ret;
}


my($testing) = 0;

if($testing)
{
    $output = &do_testing();
}
else
{
    $output = &do_socket();
}


binmode(STDOUT, ":utf8");

print($output);

exit(0);

# vim: set sw=4 sts=4 expandtab: #
