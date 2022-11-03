
my $THRESHOLD = 99;

open my $infile, '<', './coverage/coverage-summary.json' or die "error: $!";

@file = <$infile>;
close $infile;

my $error_flag = 0;
my $sum = 0;
for $line (grep /\.ts/, @file)
{	
    $line =~ tr/"//d;
    my ($file, $state_pc) = $line =~ /src\/(.*?):.*statements:{.*?pct:(.*?)}.*/;

    $error_flag = 1 if $state_pc < $THRESHOLD;
    print "$file statements: ";
    print "$state_pc\n";
}
die "Coverage less than ${THRESHOLD}%" if $error_flag == 1;
