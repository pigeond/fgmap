#!/usr/bin/perl -Tw

use strict;
use Net::HTTP;
use HTTP::Status;
binmode(STDOUT, ':utf8');

my $FGHOST = 'localhost';
my $FGPORT = 8000;

my $header = <<HEADER;
Pragma: no-cache
Cache-Control: no-cache
Expires: Sat, 17 Sep 1977 00:00:00 GMT
Content-Type: text/xml

HEADER

my $qstr = $ENV{'QUERY_STRING'};

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
my $target_name;
my $fov;

if ($qstr ne '') {

    if ($qstr eq 'next_target') {

        $target_number = fg_prop('/sim/cam/target-number');
        if (defined($target_number)) {
            fg_prop('/sim/cam/target-number', $target_number + 1);
        }
        fg_prop('/sim/cam/goto', 'true');

    } elsif ($qstr eq 'prev_target') {

        $target_number = fg_prop('/sim/cam/target-number');
        if (defined($target_number)) {
            fg_prop('/sim/cam/target-number', $target_number - 1);
        }
        fg_prop('/sim/cam/goto', 'true');

    } elsif ($qstr eq 'zoom_in') {

        $fov = fg_prop('/sim/current-view/field-of-view');
        if (defined($fov)) {
            fg_prop('/sim/current-view/field-of-view', $fov - 5.0);
        }

    } elsif ($qstr eq 'zoom_out') {

        $fov = fg_prop('/sim/current-view/field-of-view');
        if (defined($fov)) {
            fg_prop('/sim/current-view/field-of-view', $fov + 5.0);
        }

    } elsif ($qstr eq 'goto') {
        fg_prop('/sim/cam/goto', 'true');

    } elsif ($qstr eq 'poll') {

        $target_name = fg_prop('/sim/cam/target-name');
        $target_name =~ s/"/\\"/g;

    }
}

my $xml = <<XML;
<mpcam down="${down}" targetname="${target_name}" />
XML

print($header);
print($xml);

exit(0);


