const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient('https://lfoeubyyqewcnlmmxbzl.supabase.co', 'sb_publishable_vZI5aqsLIKQXvCwOmzRBNg_q045Ywn8');

// Valid columns for the paintings table in Supabase
const validColumns = [
    'paintingid', 'artistid', 'galleryid', 'imagefilename', 'title',
    'shapeid', 'museumlink', 'accessionnumber', 'copyrighttext',
    'description', 'excerpt', 'yearofwork', 'width', 'height',
    'medium', 'cost', 'msrp', 'googlelink', 'googledescription',
    'wikilink', 'jsonannotations'
];

async function seed() {
    const rawData = fs.readFileSync('art.json', 'utf8');
    const paintings = JSON.parse(rawData);

    console.log('Total paintings found in art.json:', paintings.length);

    const normalizedPaintings = paintings.map(painting => {
        const newObj = {};
        for (let key in painting) {
            const lowerKey = key.toLowerCase();
            if (validColumns.includes(lowerKey)) {
                newObj[lowerKey] = painting[key];
            }
        }
        return newObj;
    });

    for (let i = 0; i < normalizedPaintings.length; i += 50) {
        const batch = normalizedPaintings.slice(i, i + 50);
        const { error } = await supabase.from('paintings').insert(batch);
        if (error) {
            console.error('Error at batch:', error);
            break;
        }
        console.log(`Inserted records ${i} to ${i + batch.length}`);
    }
    console.log('Seeding complete!');
}

seed();