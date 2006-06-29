#!/usr/bin/perl -wT

use strict;
use IO::Socket;

#$server = "81.169.158.37";
my($server) = "localhost";
my($port) = 5003;

my($xml) = "";
my($l);


if(!defined($ENV{'QUERY_STRING'}))
{
    exit(-1);
}

($server, $port) = ($ENV{'QUERY_STRING'} =~ m#(.*?):(\d+)#);

if(!defined($server) || !(defined($port)))
{
    exit(-1);
}

$server =~ s#></\\&\?\|\!\*##g;
$port =~ s#></\\&\?\|\!\*##g;

my($pilot_total) = 0;
my($pilot_cnt) = 0;

my($socket) = IO::Socket::INET->new(PeerAddr => $server,
                                    PeerPort => $port,
                                    Proto => "tcp",
                                    Type => SOCK_STREAM,
                                    Timeout => 10);

while($l = <$socket>)
{
    my($callsign, $server_ip, $lng, $lat, $alt, $model);

    chomp($l);

    if(substr($l, 0, 1) eq "#")
    {
        if($l =~ /^# (\d+) .*? online/)
        {
            $pilot_total = $1;
        }
        next;
    }

    ($callsign, $server_ip, $lng, $lat, $alt, $model) =
        ($l =~ m/(.*?)@(.*?): .*? .*? .*? (.*?) (.*?) (.*?) (.*?)$/);

    # Aircraft/ComperSwift/Models/ComperSwift-model.x

    if($callsign and $model)
    {
        #$model =~ s#.*/(.*?)\..*?$#$1#;
        $model =~ s#.*/(.*?)#$1#;
        $model =~ s#\..*?$##;

        $xml .= "\t<marker server_ip=\"${server_ip}\" callsign=\"${callsign}\" lng=\"${lng}\" lat=\"${lat}\" alt=\"${alt}\" model=\"${model}\" />\n";

        $pilot_cnt++;

        if($pilot_cnt >= $pilot_total)
        {
            close($socket);
            undef($socket);
            last;
        }
    }
}

if($socket)
{
    close($socket);
}

my($testing) = 0;

if($testing)
{
    $xml .= "\t<marker server_ip=\"server\" callsign=\"testing\" lng=\"-122.357237\" lat=\"37.613545\" alt=\"100\" model=\"model\" />\n";
}

print("Pragma: no-cache\r\n");
print("Cache-Control: no-cache\r\n");
print("Expires: Sat, 17 Sep 1977 00:00:00 GMT\r\n");
print("Content-Type: text/xml\r\n\r\n");

print("<fg_server pilot_cnt=\"$pilot_cnt\">\n");
print($xml);
print("</fg_server>\n\n");

exit(0);

