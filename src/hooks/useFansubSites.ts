
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface FansubSite {
  id: string;
  name: string;
  url: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useFansubSites = () => {
  const [sites, setSites] = useState<FansubSite[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSites = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('fansub_sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar sites de fansub',
        variant: 'destructive'
      });
    } else {
      setSites(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSites();
  }, [user]);

  const addSite = async (siteData: { name: string; url: string; description?: string }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('fansub_sites')
      .insert([{
        ...siteData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar site',
        variant: 'destructive'
      });
    } else {
      setSites([data, ...sites]);
      toast({
        title: 'Site adicionado!',
        description: `${data.name} foi adicionado com sucesso`
      });
    }
  };

  const deleteSite = async (id: string) => {
    const { error } = await supabase
      .from('fansub_sites')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao remover site',
        variant: 'destructive'
      });
    } else {
      setSites(sites.filter(site => site.id !== id));
      toast({
        title: 'Site removido',
        description: 'Site removido com sucesso'
      });
    }
  };

  return {
    sites,
    loading,
    addSite,
    deleteSite,
    refreshSites: fetchSites
  };
};
