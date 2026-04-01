import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ------------- 分类/文件夹 (Folders) API -------------

app.get('/api/folders', async (req, res) => {
  const { data, error } = await supabase.from('folders').select('*').order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/folders', async (req, res) => {
  const { id, name, icon, color } = req.body;
  const { data, error } = await supabase.from('folders').insert([{ id, name, icon, color }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.delete('/api/folders/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('folders').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  
  // 同时由于前端的逻辑，我们可以清空属于该文件夹的prompt的folder_id
  await supabase.from('prompts').update({ folder_id: null }).eq('folder_id', id);
  
  res.json({ success: true });
});

// ------------- 提示词 (Prompts) API -------------

app.get('/api/prompts', async (req, res) => {
  const { data, error } = await supabase.from('prompts').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  
  // 转换字段名为前端需要的驼峰命名
  const formattedData = data.map(item => ({
    ...item,
    systemPrompt: item.system_prompt,
    userPrompt: item.user_prompt,
    isFavorite: item.is_favorite,
    folderId: item.folder_id,
  }));
  res.json(formattedData);
});

app.post('/api/prompts', async (req, res) => {
  const { id, title, description, systemPrompt, userPrompt, tags, date, isFavorite, folderId } = req.body;
  
  const insertData = {
    id,
    title,
    description,
    system_prompt: systemPrompt,
    user_prompt: userPrompt,
    tags: tags || [],
    date,
    is_favorite: isFavorite,
    folder_id: folderId
  };

  const { data, error } = await supabase.from('prompts').insert([insertData]).select();
  if (error) return res.status(500).json({ error: error.message });
  const item = data[0];
  res.json({
    ...item,
    systemPrompt: item.system_prompt,
    userPrompt: item.user_prompt,
    isFavorite: item.is_favorite,
    folderId: item.folder_id,
  });
});

app.put('/api/prompts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, systemPrompt, userPrompt, tags, date, isFavorite, folderId } = req.body;
  
  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (systemPrompt !== undefined) updateData.system_prompt = systemPrompt;
  if (userPrompt !== undefined) updateData.user_prompt = userPrompt;
  if (tags !== undefined) updateData.tags = tags;
  if (date !== undefined) updateData.date = date;
  if (isFavorite !== undefined) updateData.is_favorite = isFavorite;
  if (folderId !== undefined) updateData.folder_id = folderId;

  const { data, error } = await supabase.from('prompts').update(updateData).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  const item = data[0];
  res.json({
    ...item,
    systemPrompt: item.system_prompt,
    userPrompt: item.user_prompt,
    isFavorite: item.is_favorite,
    folderId: item.folder_id,
  });
});

app.delete('/api/prompts/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('prompts').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
