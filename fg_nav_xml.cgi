#!/usr/bin/perl -Tw
#
# Author: Pigeon <pigeon at pigeond dot net>
#
# Under debian, you need libdbix-easy-perl,
# libdbd-pg-perl (postgres) or libdbd-mysql-perl (mysql)
#

use strict;
use DBIx::Easy;

print("Pragma: no-cache\r\n");
print("Cache-Control: no-cache\r\n");
print("Expires: Sat, 17 Sep 1977 00:00:00 GMT\r\n");
print("Content-Type: text/xml\r\n\r\n");


my($xml) = "<navaids>\n";

my($APT_TABLE) = "fg_apt";
my($APTWAY_TABLE) = "fg_apt_way";
my($APT_LIMIT) = 10;


if(!$ENV{'QUERY_STRING'})
{
    exit(0);
}

# search string
my($sstr);
# search options
my($apt, $nav, $fix, $awy, $taxiway);

my($p);
my(@a) = split(/\&/, $ENV{'QUERY_STRING'});

foreach $p (@a)
{
    my($key, $value) = split(/=/, $p);

    if($key eq 'sstr')
    {
        $sstr = $value;
    }
    elsif($key eq 'apt')
    {
        $apt = 1;
    }
    elsif($key eq 'taxiway')
    {
        # We want taxiway too
        $taxiway = 1;
    }
}

my($dbi);
my($sth);

#$dbi = new DBIx::Easy qw(mysql flightgear fgmap);
$dbi = new DBIx::Easy qw(Pg flightgear fgmap);

if(!$dbi)
{
    # TODO
    exit(0);
}



my($sql) = "";

if(!$sstr)
{
    exit(0);
}

$sstr =~ s/%([a-fA-F0-9][a-f-A-F0-9])/pack("C", hex($1))/ge;

if($apt)
{
    # airport
    $xml .= "\t<apt>\n";

    $sql .= "SELECT * FROM ${APT_TABLE} WHERE ";

    $sstr =~ s/[\%\*\.\?\_]//g;
    $sql .= "upper(apt_code) like '\%".uc(${sstr})."\%' or upper(apt_name) like '\%".uc(${sstr})."\%'";
    $sql .= " ORDER BY apt_code LIMIT ${APT_LIMIT};";

    #print(STDERR "$sql\n");
    my($sth) = $dbi->process($sql);

    if($sth->rows > 0)
    {
        my($i, $j);

        for($i = 0; $i < $sth->rows; $i++)
        {
            my($row_href) = $sth->fetchrow_hashref;
            my(%row_hash) = %$row_href;
            $xml .= <<XML;
    \t\t<airport code="$row_hash{'apt_code'}" name="$row_hash{'apt_name'}" elevation="$row_hash{'elevation'}">
XML

            my($apt_id) = $row_hash{'apt_id'};

            my($aptway_sql) =
                "SELECT * FROM ${APTWAY_TABLE} WHERE apt_id=${apt_id}";
            if(!$taxiway)
            {
                $aptway_sql .= " AND type = 'r'";
            }
            $aptway_sql .= " ORDER BY type;";

            my($apt_sth) = $dbi->process($aptway_sql);
            
            for($j = 0; $j < $apt_sth->rows; $j++)
            {
                my($aptway_href) = $apt_sth->fetchrow_hashref;
                my(%aptway_hash) = %$aptway_href;
                my($type) = $aptway_hash{'type'};
                my($num) = $aptway_hash{'num'};

                #$num =~ s/^\s*//g;
                #$num =~ s/\s*$//g;

                $xml .= "\t\t\t<";

                if($type eq "r")
                {
                    $xml .= "runway num=\"${num}\"";
                }
                elsif($type eq "t")
                {
                    $xml .= "taxiway";
                }

                $xml .= " ";

                $xml .= <<XML;
lat="$aptway_hash{'lat'}" lng="$aptway_hash{'lng'}" heading="$aptway_hash{'heading'}" length="$aptway_hash{'length'}" width="$aptway_hash{'width'}" />
XML
            }

            $xml .= "\t\t</airport>\n\n";
        }

    }

    $xml .= "\t</apt>\n";
}

if($nav)
{

}



$xml .= "</navaids>\n\n";
print($xml);

exit(0);

