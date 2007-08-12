#!/usr/bin/perl -Tw

use strict;
use Net::HTTP;
use HTTP::Status;
binmode(STDOUT, ':utf8');

my $FGHOST = 'localhost';
my $FGPORT = 8000;

print("Content-type: text/xml\n\n");

my $qstr = $ENV{'QUERY_STRING'};

sub fg_prop {
    
    my ($path, $set) = @_;
    my $value = undef;

    my $hreq;

    $hreq = Net::HTTP->new(Host => $FGHOST, PeerPort => $FGPORT) or
        return undef;
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

my $xml = '<mpcam />';

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

        $xml = <<XML;
<mpcam targetname="${target_name}" />
XML

    }
}

print($xml);

exit(0);

my $out = <<HTML;

<html>

<body>

<table cellpadding="0" cellspacing="8" width="100%" border="0">
<tr>
<td align="center" width="1"><a href="?prev_target">prev</a></td>
<td align="center" width="24">${target_name} (${target_number})</td>
<td align="center" width="1"><a href="?next_target">next</a></td>
<td align="center" width="1"><a href="?goto">goto</a></td>
<td align="center" width="1"><a href="?zoom_in">zoom +</a></td>
<td align="center" width="1"><a href="?zoom_out">zoom -</a></td>
</tr>
</table>

</body>

</html>
HTML

print($out);

exit(0);

