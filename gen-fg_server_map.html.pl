#!/usr/bin/perl -w

# Simple perl script to generate fg_server_map.html from fg_server_map.html.in
# See README, fgmap.keys and fgmap.servers

use strict;

my $FGMAP_KEYS = 'fgmap.keys';
my $FGMAP_KEYS_TAG = '<!-- ### fgmap.keys ### -->';

my $FGMAP_SERVERS = 'fgmap.servers';
my $FGMAP_SERVERS_TAG = '// ### fgmap.servers ###';

my $TEMPLATE = 'fg_server_map.html.in';
my $OUTPUT = 'fg_server_map.html';

my $GMAPI_VERSION = '2.66';

my $ssis = "";
my @lines;
my $fh;

open($fh, ${FGMAP_KEYS}) or die("${FGMAP_KEYS} does not exist...");
@lines = grep(!/(^#|^$)/, <$fh>);
close($fh);

print("Reading [${FGMAP_KEYS}]\n");

foreach my $l (@lines)
{
    chomp($l);

    my($host, $key) = split(/::/, $l);

    print("Adding key for host [${host}]\n");

    $ssis .= <<SSI;
<!--#if expr="\\"\${HTTP_HOST}\\" = \\"${host}\\"" -->
    <!-- Using HTTP_HOST ${host} -->
    <script type="text/javascript" src="//maps.googleapis.com/maps/api/js?key=${key}&amp;sensor=false"></script>
<!--#endif -->

SSI
}


my $js = "";

open($fh, ${FGMAP_SERVERS}) or die("${FGMAP_SERVERS} does not exist...");
@lines = grep(!/(^#|^$)/, <$fh>);
close($fh);

print("Reading [${FGMAP_SERVERS}]\n");

foreach my $l (@lines)
{
    chomp($l);

    my($id, $desc, $host, $port, $ip) = split(/::/, $l, 5);

    if($id && $desc && $host && $port)
    {
        print("Adding server [${id}]\n");

        $js .= <<JS;
            fgmap.server_add("${id}",
                "${desc}",
                "${host}", ${port},
                "${ip}");

JS
    }
    elsif($id)
    {
        print("Adding server group [${id}]\n");

        $js .= <<JS;
            fgmap.server_group_add("${id}");

JS
    }

}


open($fh, ${TEMPLATE});
my($lines) = join("", <$fh>);
close($fh);

$lines =~ s/${FGMAP_KEYS_TAG}/${ssis}/;
$lines =~ s/${FGMAP_SERVERS_TAG}/${js}/;

print("Generating [${OUTPUT}]\n");
open($fh, ">${OUTPUT}");
print($fh $lines);
close($fh);

print("Done.\n");
exit(0);



# vim: set sw=4 sts=4 expandtab: #
