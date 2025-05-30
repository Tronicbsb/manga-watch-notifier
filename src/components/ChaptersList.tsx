
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { useChapters } from '@/hooks/useChapters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChaptersListProps {
  mangaId: string;
  mangaTitle: string;
}

export const ChaptersList = ({ mangaId, mangaTitle }: ChaptersListProps) => {
  const { chapters, loading, addChapter, toggleChapterRead, deleteChapter } = useChapters(mangaId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChapter, setNewChapter] = useState({
    chapter_number: '',
    chapter_title: '',
    release_date: ''
  });

  const handleAddChapter = async () => {
    if (!newChapter.chapter_number) return;

    await addChapter({
      chapter_number: newChapter.chapter_number,
      chapter_title: newChapter.chapter_title || undefined,
      release_date: newChapter.release_date || undefined
    });

    setNewChapter({ chapter_number: '', chapter_title: '', release_date: '' });
    setIsDialogOpen(false);
  };

  const readChapters = chapters.filter(c => c.is_read).length;
  const totalChapters = chapters.length;

  if (loading) {
    return <div className="text-center p-4">Carregando capítulos...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{mangaTitle}</CardTitle>
            <CardDescription>
              {readChapters} de {totalChapters} capítulos lidos
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Capítulo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Capítulo</DialogTitle>
                <DialogDescription>
                  Adicione um novo capítulo para {mangaTitle}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="chapter-number" className="text-right">
                    Número *
                  </Label>
                  <Input
                    id="chapter-number"
                    value={newChapter.chapter_number}
                    onChange={(e) => setNewChapter({ ...newChapter, chapter_number: e.target.value })}
                    className="col-span-3"
                    placeholder="Ex: 1095"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="chapter-title" className="text-right">
                    Título
                  </Label>
                  <Input
                    id="chapter-title"
                    value={newChapter.chapter_title}
                    onChange={(e) => setNewChapter({ ...newChapter, chapter_title: e.target.value })}
                    className="col-span-3"
                    placeholder="Ex: A Grande Batalha"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="release-date" className="text-right">
                    Data
                  </Label>
                  <Input
                    id="release-date"
                    type="date"
                    value={newChapter.release_date}
                    onChange={(e) => setNewChapter({ ...newChapter, release_date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddChapter} className="bg-gradient-primary">
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {chapters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum capítulo adicionado ainda.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Lido</TableHead>
                <TableHead>Capítulo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-12">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters.map((chapter) => (
                <TableRow key={chapter.id}>
                  <TableCell>
                    <Checkbox
                      checked={chapter.is_read}
                      onCheckedChange={() => toggleChapterRead(chapter.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={chapter.is_read ? "default" : "secondary"}>
                      Cap. {chapter.chapter_number}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {chapter.chapter_title || '-'}
                  </TableCell>
                  <TableCell>
                    {chapter.release_date ? (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(chapter.release_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteChapter(chapter.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
