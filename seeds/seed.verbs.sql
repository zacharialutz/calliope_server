-- psql -U zacharialutz -d wordbank -f ./seeds/seed.verbs.sql
-- last pull from master: 11-20-19

DELETE FROM verbs; -- clear table for re-seeding

INSERT INTO verbs (infinitive, present, past, gerund)
VALUES
    ('belch','belches','belched','blelching'),
    ('bleed','bleeds','bled','bleeding'),
    ('burn','burns','burned','burning'),
    ('burp','burps','burped','burping'),
    ('burrow','burrows','burrowed','burrowing'),
    ('campaign','campaigns','campaigned','campaigning'),
    ('code','codes','coded','coding'),
    ('complain','complains','complained','complaining'),
    ('cook','cooks','cooked','cooking'),
    ('crawl','crawls','crawled','crawling'),
    ('creep','creeps','crept','creeping'),
    ('cry','cries','cried','crying'),
    ('cuddle','cuddles','cuddled','cuddling'),
    ('dance','dances','danced','dancing'),
    ('die','dies','died','dying'),
    ('draw','draws','drew','drawing'),
    ('dream','dreams','dreamt','dreaming'),
    ('drink','drinks','drank','drinking'),
    ('drool','drools','drooled','drolling'),
    ('eat','eats','ate','eating'),
    ('explore','explores','explored','exploring'),
    ('farm','farms','farmed','farming'),
    ('fart','farts','farted','farting'),
    ('fight','fights','fought','fighting'),
    ('fly','flies','flew','flying'),
    ('forgive','forgives','forgave','forgiving'),
    ('frown','frowns','frowned','frowning'),
    ('gamble','gambles','gambled','gambling'),
    ('garden','gardens','gardened','gardening'),
    ('grin','grins','grinned','grinning'),
    ('hate','hates','hated','hating'),
    ('hide','hides','hid','hiding'),
    ('hop','hops','hopped','hopping'),
    ('hope','hopes','hoped','hoping'),
    ('hum','hums','hummed','humming'),
    ('hunt','hunts','hunted','hunting'),
    ('imagine','imagines','imagined','imagining'),
    ('jog','jogs','jogged','jogging'),
    ('joke','jokes','joked','joking'),
    ('jump','jumps','jumped','jumping'),
    ('kill','kills','killed','killing'),
    ('kiss','kisses','kissed','kissing'),
    ('knit','knits','knitted','knitting'),
    ('laugh','laughs','laughed','laughing'),
    ('learn','learns','learned','learning'),
    ('lie','lies','lied','lying'),
    ('limp','limps','limped','limping'),
    ('live','lives','lived','living'),
    ('love','loves','loved','loving'),
    ('march','marches','marched','marching'),
    ('mumble','mumbles','mumbled','mumbling'),
    ('murder','murders','murdered','murdering'),
    ('navigate','navigates','navigated','navigating'),
    ('pace','paces','paced','pacing'),
    ('paint','paints','painted','painting'),
    ('party','parties','partied','partying'),
    ('play','plays','played','playing'),
    ('pray','prays','prayed','praying'),
    ('preach','preaches','preached','preaching'),
    ('rage','rages','raged','raging'),
    ('rest','rests','rested','resting'),
    ('run','runs','ran','running'),
    ('scream','screams','screamed','screaming'),
    ('sew','sews','sewed','sewing'),
    ('shiver','shivers','shivered','shivering'),
    ('shout','shouts','shouted','shouting'),
    ('sigh','sighs','sighed','sighing'),
    ('sing','sings','sang','singing'),
    ('sit','sits','sat','sitting'),
    ('sleep','sleeps','slept','sleeping'),
    ('smile','smiles','smiled','smiling'),
    ('sneak','sneaks','snuk','sneaking'),
    ('sniffle','sniffles','sniffled','sniffling'),
    ('snore','snores','snored','snoring'),
    ('sob','sobs','sobbed','sobbing'),
    ('sparkle','sparkles','sparkled','sparkling'),
    ('stand','stands','stood','standing'),
    ('steal','steals','stole','stealing'),
    ('swear','swears','swore','swearing'),
    ('sweat','seats','sweated','sweating'),
    ('sweep','sweeps','swept','sweeping'),
    ('swim','swims','swam','swimming'),
    ('take notes','takes notes','took notes','taking notes'),
    ('think','thinks','thought','thinking'),
    ('tinker','tinkers','tinkered','tinkering'),
    ('travel','travels','traveled','traveling'),
    ('twirl','twirls','twirled','twirling'),
    ('type','types','typed','typing'),
    ('vote','votes','voted','voting'),
    ('walk','walks','walked','walking'),
    ('waltz','waltzes','waltzed','waltzing'),
    ('weep','weeps','wept','weeping'),
    ('whine','whines','whined','whining'),
    ('whisper','whispers','whispered','whispering'),
    ('whistle','whistles','whistled','whistling'),
    ('wish','wishes','wished','wishing'),
    ('wonder','wonders','wondered','wondering'),
    ('work','works','worked','working'),
    ('write','writes','wrote','writing'),
    ('yell','yells','yelled','yelling');