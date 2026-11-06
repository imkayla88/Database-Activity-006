const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // <-- Tells Express to serve static files from your project folder

const supabaseUrl = 'https://lfoeubyyqewcnlmmxbzl.supabase.co';
const supabaseKey = 'sb_publishable_vZI5aqsLIKQXvCwOmzRBNg_q045Ywn8';
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/api/paintings', async (req, res) => {
    const { data, error } = await supabase.from('paintings').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

const PORT = 3000;
// PUT route to update painting information in Supabase
app.put('/api/paintings/:id', async (req, res) => {
    const { id } = req.params;
    const { title, medium, yearofwork, description } = req.body;

    const { data, error } = await supabase
        .from('paintings')
        .update({ title, medium, yearofwork, description })
        .eq('paintingid', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));