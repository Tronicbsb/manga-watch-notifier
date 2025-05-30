
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Chapter {
  id: string;
  manga_id: string;
  chapter_number: string;
  chapter_title?: string;
  release_date?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export const useChapters = (mangaId: string) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchChapters = async () => {
    if (!mangaId) return;
    
    const { data, error } = await supabase
      .from('manga_chapters')
      .select('*')
      .eq('manga_id', mangaId)
      .order('chapter_number', { ascending: false });

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar capítulos',
        variant: 'destructive'
      });
    } else {
      setChapters(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChapters();
  }, [mangaId]);

  const addChapter = async (chapterData: { 
    chapter_number: string; 
    chapter_title?: string; 
    release_date?: string 
  }) => {
    const { data, error } = await supabase
      .from('manga_chapters')
      .insert([{
        ...chapterData,
        manga_id: mangaId
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar capítulo',
        variant: 'destructive'
      });
    } else {
      setChapters([data, ...chapters]);
      toast({
        title: 'Capítulo adicionado!',
        description: `Capítulo ${data.chapter_number} foi adicionado`
      });
    }
  };

  const toggleChapterRead = async (id: string) => {
    const chapter = chapters.find(c => c.id === id);
    if (!chapter) return;

    const newReadStatus = !chapter.is_read;
    const { error } = await supabase
      .from('manga_chapters')
      .update({ 
        is_read: newReadStatus,
        read_at: newReadStatus ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status de leitura',
        variant: 'destructive'
      });
    } else {
      setChapters(chapters.map(c => 
        c.id === id ? { 
          ...c, 
          is_read: newReadStatus,
          read_at: newReadStatus ? new Date().toISOString() : undefined
        } : c
      ));
    }
  };

  const deleteChapter = async (id: string) => {
    const { error } = await supabase
      .from('manga_chapters')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao remover capítulo',
        variant: 'destructive'
      });
    } else {
      setChapters(chapters.filter(chapter => chapter.id !== id));
      toast({
        title: 'Capítulo removido',
        description: 'Capítulo removido com sucesso'
      });
    }
  };

  return {
    chapters,
    loading,
    addChapter,
    toggleChapterRead,
    deleteChapter,
    refreshChapters: fetchChapters
  };
};
