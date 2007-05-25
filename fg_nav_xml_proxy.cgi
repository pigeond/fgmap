#!/usr/bin/perl -wT

# Under debian, you need libwww-perl

use strict;
use Net::HTTP;
use HTTP::Status;

my($host) = 'pigeond.net';
my($port) = 80;
my($url) = '/flightgear/fgmap/fg_nav_xml.cgi';
my($buf);

binmode(STDOUT, ":utf8");

if(!defined($ENV{'QUERY_STRING'}))
{
    exit(-1);
}

my($req) = Net::HTTP->new(Host => $host, PeerPort => $port, Timeout => 30);

if($req)
{
    $req->http_version('1.1');
    $req->write_request(GET => ${url}.'?'.$ENV{'QUERY_STRING'});

    my($code, $mess, %h) = $req->read_response_headers();

    if($code == RC_OK)
    {
        print("Pragma: no-cache\r\n");
        print("Cache-Control: no-cache\r\n");
        print("Expires: Sat, 17 Sep 1977 00:00:00 GMT\r\n");
        print("Content-Type: text/xml\r\n\r\n");

        while($req->read_entity_body($buf, 1024))
        {
            print($buf);
        }
    }

}

exit(0);

# vim: set sw=4 sts=4 expandtab: #
