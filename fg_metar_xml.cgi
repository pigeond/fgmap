#!/usr/bin/perl -Tw
#
#
# Author: Pigeon <pigeon at pigeond dot net>
#
# On debian, apt-get install metar


use strict;

if(!$ENV{'QUERY_STRING'})
{
    exit(0);
}

my($id) = $ENV{'QUERY_STRING'};

if($id =~ m/([0-9A-Za-z]+)/)
{
    $id = $1;
}

if(!$id || $id eq "")
{
    exit(0);
}

print("Pragma: no-cache\r\n");
print("Cache-Control: no-cache\r\n");
print("Expires: Sat, 17 Sep 1977 00:00:00 GMT\r\n");
print("Content-Type: text/xml\r\n\r\n");

delete(@ENV{'IFS', 'CDPATH', 'ENV', 'BASH_ENV', 'PATH'});

$id = uc($id);
my(@res) = `/usr/bin/metar -d ${id} 2>&1`;

my($raw);

my($l);
my($k, $v);
my(%h) = ();

my(@gmt) = gmtime();

foreach $l (@res)
{
    chomp($l);

    if($l =~ m/not found/)
    {
        last;
    }
    elsif($l =~ m/^${id} .*$/)
    {
        $h{'Raw'} = $l;
        next;
    }

    if($l =~ m/:/)
    {
        ($k, $v) = split(/:/, $l, 2);
        $k =~ s/^ +//g;
        $k =~ s/ +$//g;
        $v =~ s/^ +//g;
        $v =~ s/ +$//g;
        $v =~ s/"//g;

        if($k eq 'Station')
        {
            next;
        }
        elsif($k eq 'Time')
        {
        }

        $h{$k} = $v;
    }
    else
    {
        $l =~ s/^ +//g;
        $l =~ s/ +$//g;
        $h{$k} = $h{$k}.", ".$l;
    }
}

print("<metar>\n\t<metar>\n");

my(@metar_order) = ('Day', 'Time', 'Raw', 'Temperature', 'Dewpoint', 'Pressure', 'Visibility', 'Wind direction', 'Wind speed', 'Wind gust', 'Clouds', 'Phenomena');

#foreach $k (keys(%h))
foreach $k (@metar_order)
{
    print <<XML;
	<field name="${k}" value="$h{${k}}" />
XML
}

#print <<TEST;
#		<field name="Dewpoint" value="8 C" />
#		<field name="Time" value="10" />
#		<field name="Clouds" value="FEW at 1300 ft, SCT at 2600 ft" />
#		<field name="Station" value="KSFO" />
#		<field name="Wind gust" value="9 KT" />
#		<field name="Wind speed" value="9 KT" />
#		<field name="Wind direction" value="260 (W)" />
#		<field name="Temperature" value="11 C" />
#		<field name="Phenomena" value="" />
#		<field name="Visibility" value="10 SM" />
#		<field name="Pressure" value="29.96 Hg" />
#		<field name="Raw" value="KSFO 271056Z 26009KT 10SM FEW013 SCT026 11/08 A2996 RMK AO2 SLP144 T01060083" />
#		<field name="Day" value="27" />
#TEST

print("\t</metar>\n</metar>\n");

exit(0);

