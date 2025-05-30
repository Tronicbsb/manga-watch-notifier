
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Globe, Plus, Bell, Trash2, LogOut, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFansubSites } from "@/hooks/useFansubSites";
import { useMangas } from "@/hooks/useMangas";
import { AuthForm } from "@/components/AuthForm";
import { ChaptersList } from "@/components/ChaptersList";

const Index = () => {
  const { user, signOut } = useAuth();
  const { sites, addSite, deleteSite } = useFansubSites();
  const { mangas, addManga, toggleMangaStatus, deleteManga } = useMangas();
  
  const [newSite, setNewSite] = useState({ name: "", url: "", description: "" });
  const [newManga, setNewManga] = useState({ title: "", fansub_site_id: "" });
  const [isSiteDialogOpen, setIsSiteDialogOpen] = useState(false);
  const [isMangaDialogOpen, setIsMangaDialogOpen] = useState(false);
  const [selectedMangaId, setSelectedMangaId] = useState<string | null>(null);

  if (!user) {
    return <AuthForm />;
  }

  const handleAddSite = async () => {
    if (!newSite.name || !newSite.url) return;
    
    await addSite(newSite);
    setNewSite({ name: "", url: "", description: "" });
    setIsSiteDialogOpen(false);
  };

  const handleAddManga = async () => {
    if (!newManga.title || !newManga.fansub_site_id) return;
    
    await addManga(newManga);
    setNewManga({ title: "", fansub_site_id: "" });
    setIsMangaDialogOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const activeMangas = mangas.filter(manga => manga.is_active);

  if (selectedMangaId) {
    const selectedManga = mangas.find(m => m.id === selectedMangaId);
    return (
      <div className="min-h-screen bg-gradient-to-br from-manga-50 to-manga-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedMangaId(null)}
            >
              ← Voltar
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
          <ChaptersList 
            mangaId={selectedMangaId} 
            mangaTitle={selectedManga?.title || ''} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-manga-50 to-manga-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            Manga Tracker
          </h1>
          <p className="text-lg text-muted-foreground">
            Gerencie seus sites de fansub e acompanhe atualizações dos seus mangás favoritos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sites Cadastrados</CardTitle>
              <Globe className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sites.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mangás Ativos</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeMangas.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Mangás</CardTitle>
              <Bell className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mangas.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="mangas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mangas">Meus Mangás</TabsTrigger>
            <TabsTrigger value="sites">Sites de Fansub</TabsTrigger>
          </TabsList>

          <TabsContent value="mangas" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Mangás para Acompanhar</h2>
              <Dialog open={isMangaDialogOpen} onOpenChange={setIsMangaDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Mangá
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Mangá</DialogTitle>
                    <DialogDescription>
                      Adicione um mangá para acompanhar as atualizações
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="manga-title" className="text-right">
                        Título
                      </Label>
                      <Input
                        id="manga-title"
                        value={newManga.title}
                        onChange={(e) => setNewManga({ ...newManga, title: e.target.value })}
                        className="col-span-3"
                        placeholder="Ex: One Piece"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="manga-site" className="text-right">
                        Site
                      </Label>
                      <select
                        id="manga-site"
                        value={newManga.fansub_site_id}
                        onChange={(e) => setNewManga({ ...newManga, fansub_site_id: e.target.value })}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione um site</option>
                        {sites.map(site => (
                          <option key={site.id} value={site.id}>{site.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddManga} className="bg-gradient-primary">
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mangas.map(manga => (
                <Card key={manga.id} className="hover:shadow-lg transition-shadow animate-fade-in">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{manga.title}</CardTitle>
                        <CardDescription>{manga.fansub_sites?.name}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMangaId(manga.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMangaStatus(manga.id)}
                        >
                          <Bell className={`h-4 w-4 ${manga.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteManga(manga.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant={manga.is_active ? "default" : "secondary"}>
                        {manga.is_active ? "Ativo" : "Pausado"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sites" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Sites de Fansub</h2>
              <Dialog open={isSiteDialogOpen} onOpenChange={setIsSiteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Site
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Site de Fansub</DialogTitle>
                    <DialogDescription>
                      Cadastre um novo site de fansub para acompanhar mangás
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="site-name" className="text-right">
                        Nome
                      </Label>
                      <Input
                        id="site-name"
                        value={newSite.name}
                        onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                        className="col-span-3"
                        placeholder="Ex: Mangá Livre"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="site-url" className="text-right">
                        URL
                      </Label>
                      <Input
                        id="site-url"
                        value={newSite.url}
                        onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                        className="col-span-3"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="site-description" className="text-right">
                        Descrição
                      </Label>
                      <Input
                        id="site-description"
                        value={newSite.description}
                        onChange={(e) => setNewSite({ ...newSite, description: e.target.value })}
                        className="col-span-3"
                        placeholder="Descrição opcional"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddSite} className="bg-gradient-primary">
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map(site => (
                <Card key={site.id} className="hover:shadow-lg transition-shadow animate-fade-in">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{site.name}</CardTitle>
                        <CardDescription>{site.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSite(site.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground break-all">{site.url}</p>
                      <Badge>
                        {mangas.filter(manga => manga.fansub_site_id === site.id).length} mangás
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
