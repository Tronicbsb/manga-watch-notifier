
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Manga {
  id: string;
  title: string;
  fansub_site_id: string;
  is_active: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  fansub_sites?: {
    name: string;
  };
}

export const useMangas = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMangas = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('mangas')
      .select(`
        *,
        fansub_sites (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar mangás',
        variant: 'destructive'
      });
    } else {
      setMangas(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMangas();
  }, [user]);

  const addManga = async (mangaData: { title: string; fansub_site_id: string }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mangas')
      .insert([{
        ...mangaData,
        user_id: user.id
      }])
      .select(`
        *,
        fansub_sites (
          name
        )
      `)
      .single();

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar mangá',
        variant: 'destructive'
      });
    } else {
      setMangas([data, ...mangas]);
      toast({
        title: 'Mangá adicionado!',
        description: `${data.title} foi adicionado à sua lista`
      });
    }
  };

  const toggleMangaStatus = async (id: string) => {
    const manga = mangas.find(m => m.id === id);
    if (!manga) return;

    const { error } = await supabase
      .from('mangas')
      .update({ is_active: !manga.is_active })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status do mangá',
        variant: 'destructive'
      });
    } else {
      setMangas(mangas.map(m => 
        m.id === id ? { ...m, is_active: !m.is_active } : m
      ));
    }
  };

  const deleteManga = async (id: string) => {
    const { error } = await supabase
      .from('mangas')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao remover mangá',
        variant: 'destructive'
      });
    } else {
      setMangas(mangas.filter(manga => manga.id !== id));
      toast({
        title: 'Mangá removido',
        description: 'Mangá removido da sua lista'
      });
    }
  };

  return {
    mangas,
    loading,
    addManga,
    toggleMangaStatus,
    deleteManga,
    refreshMangas: fetchMangas
  };
};
