import { Prompt, Folder } from '../types';
import { supabase } from '../lib/supabase';

export const api = {
  // Folders
  getFolders: async (): Promise<Folder[]> => {
    const { data, error } = await supabase.from('folders').select('*').order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },

  createFolder: async (folder: Partial<Folder>): Promise<Folder> => {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('folders').insert([{
      ...folder,
      user_id: userData?.user?.id
    }]).select();
    if (error) throw new Error(error.message);
    return data[0];
  },

  deleteFolder: async (id: string): Promise<void> => {
    const { error } = await supabase.from('folders').delete().eq('id', id);
    if (error) throw new Error(error.message);

    // 同时由于前端的逻辑，我们可以清空属于该文件夹的prompt的folder_id
    await supabase.from('prompts').update({ folder_id: null }).eq('folder_id', id);
  },

  // Prompts
  getPrompts: async (): Promise<Prompt[]> => {
    const { data, error } = await supabase.from('prompts').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    return data.map(item => ({
      ...item,
      systemPrompt: item.system_prompt,
      userPrompt: item.user_prompt,
      isFavorite: item.is_favorite,
      folderId: item.folder_id,
    }));
  },

  createPrompt: async (prompt: Partial<Prompt>): Promise<Prompt> => {
    const { data: userData } = await supabase.auth.getUser();
    const insertData = { ...prompt };

    const dbData = {
      id: insertData.id,
      user_id: userData?.user?.id,
      title: insertData.title,
      description: insertData.description,
      system_prompt: insertData.systemPrompt,
      user_prompt: insertData.userPrompt,
      tags: insertData.tags || [],
      date: insertData.date,
      is_favorite: insertData.isFavorite,
      folder_id: insertData.folderId
    };

    const { data, error } = await supabase.from('prompts').insert([dbData]).select();
    if (error) throw new Error(error.message);
    const item = data[0];
    return {
      ...item,
      systemPrompt: item.system_prompt,
      userPrompt: item.user_prompt,
      isFavorite: item.is_favorite,
      folderId: item.folder_id,
    };
  },

  updatePrompt: async (id: string, prompt: Partial<Prompt>): Promise<Prompt> => {
    const updateData: any = {};
    if (prompt.title !== undefined) updateData.title = prompt.title;
    if (prompt.description !== undefined) updateData.description = prompt.description;
    if (prompt.systemPrompt !== undefined) updateData.system_prompt = prompt.systemPrompt;
    if (prompt.userPrompt !== undefined) updateData.user_prompt = prompt.userPrompt;
    if (prompt.tags !== undefined) updateData.tags = prompt.tags;
    if (prompt.date !== undefined) updateData.date = prompt.date;
    if (prompt.isFavorite !== undefined) updateData.is_favorite = prompt.isFavorite;
    if (prompt.folderId !== undefined) updateData.folder_id = prompt.folderId;

    const { data, error } = await supabase.from('prompts').update(updateData).eq('id', id).select();
    if (error) throw new Error(error.message);
    const item = data[0];
    return {
      ...item,
      systemPrompt: item.system_prompt,
      userPrompt: item.user_prompt,
      isFavorite: item.is_favorite,
      folderId: item.folder_id,
    };
  },

  deletePrompt: async (id: string): Promise<void> => {
    const { error } = await supabase.from('prompts').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
};
