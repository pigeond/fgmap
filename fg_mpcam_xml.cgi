#!/usr/bin/perl -Tw

use strict;
use Net::HTTP;
use HTTP::Status;
binmode(STDOUT, ':utf8');

my $FGHOST = 'localhost';
my $FGPORT = 8000;
my $FGFOV_K = 1.10778066622128886919;

my $header = <<HEADER;
Pragma: no-cache
Cache-Control: no-cache
Expires: Sat, 17 Sep 1977 00:00:00 GMT
Content-Type: text/xml

HEADER

my $qstr = $ENV{'QUERY_STRING'};

my ($action, $arg) = split(/=/, $qstr, 2);

my $down = 0;

sub fg_prop {
    
    my ($path, $set) = @_;
    my $value = undef;

    my $hreq;

    $hreq = Net::HTTP->new(Host => $FGHOST, PeerPort => $FGPORT);

    if(!defined($hreq)) {
        $down = 1;
        return undef;
    }

    $hreq->http_version("1.1");

    if ($set) {
        $hreq->write_request(GET => "${path}?value=${set}&submit=update");
    } else {
        $hreq->write_request(GET => "${path}");
    }

    my ($code, $mess, %h) = $hreq->read_response_headers;

    if ($code == RC_OK) {
        my $buf;
        my $n = $hreq->read_entity_body($buf, 1024);
        if ($n > 0) {
            ($value) =
                ($buf =~ m/<input type=text .*? value="(.*?)"/gms);
        }
    }

    return $value;
}

my $target_number;
my $target_name = "";
my $fov;

if ($action ne '') {

    if ($action eq 'next_target') {

        $target_number = fg_prop('/sim/cam/target-number');
        if (defined($target_number)) {
            fg_prop('/sim/cam/target-number', $target_number + 1);
        }
        fg_prop('/sim/cam/goto', 'true');

    } elsif ($action eq 'prev_target') {

        $target_number = fg_prop('/sim/cam/target-number');
        if (defined($target_number)) {
            fg_prop('/sim/cam/target-number', $target_number - 1);
        }
        fg_prop('/sim/cam/goto', 'true');

    } elsif ($action eq 'set_target_name') {

        if ($arg ne '') {
            fg_prop('/sim/cam/target-name', $arg);
            fg_prop('/sim/cam/goto', 'true');
        }

    } elsif ($action eq 'zoom_in') {

        $fov = fg_prop('/sim/current-view/field-of-view');
        if (defined($fov)) {
            $fov /= $FGFOV_K;
            $fov = 0.1 if ($fov < 0.1);
            fg_prop('/sim/current-view/field-of-view', $fov);
        }

    } elsif ($action eq 'zoom_out') {

        $fov = fg_prop('/sim/current-view/field-of-view');
        if (defined($fov)) {
            $fov *= $FGFOV_K;
            $fov = 120 if ($fov > 120);
            fg_prop('/sim/current-view/field-of-view', $fov);
        }

    } elsif ($action eq 'goto') {

        fg_prop('/sim/cam/goto', 'true');

    } elsif ($action eq 'poll') {

        $target_name = fg_prop('/sim/cam/target-name');
        $target_name =~ s/"/\\"/g;

    } elsif ($action eq 'set_latlng') {

        my ($lat, $lng) = split(/,/, $arg);

        if($lat =~ /^-?[\d\.]+$/ && $lng =~ /^-?[\d\.]+$/) {
            fg_prop('/position/latitude-deg', $lat);
            fg_prop('/position/longitude-deg', $lng);
        }
    }
}

my $xml = <<XML;
<mpcam down="${down}" targetname="${target_name}" />
XML

print($header);
print($xml);

exit(0);


