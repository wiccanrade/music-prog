import { useState } from 'react';
import {
  Box,
  Button,
  Select,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
} from '@chakra-ui/react';
import { GenerationOptions, Song } from '../types/types';
import { generateMusic } from '../services/musicService';

export default function MusicGenerator() {
  const [options, setOptions] = useState<GenerationOptions>({
    genre: '',
    theme: '',
    mood: '',
  });
  const [loading, setLoading] = useState(false);
  const [song, setSong] = useState<Song | null>(null);
  const toast = useToast();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const generatedSong = await generateMusic(options);
      setSong(generatedSong);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Müzik oluşturulurken bir hata oluştu.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6}>
        <Heading>AI Müzik Üretici</Heading>

        <Select
          placeholder="Müzik tarzı seçin"
          value={options.genre}
          onChange={(e) => setOptions({ ...options, genre: e.target.value })}
        >
          <option value="pop">Pop</option>
          <option value="rock">Rock</option>
          <option value="rap">Rap</option>
          <option value="classical">Klasik</option>
        </Select>

        <Input
          placeholder="Tema (örn: aşk, doğa, hayat)"
          value={options.theme}
          onChange={(e) => setOptions({ ...options, theme: e.target.value })}
        />

        <Select
          placeholder="Ruh hali seçin"
          value={options.mood}
          onChange={(e) => setOptions({ ...options, mood: e.target.value })}
        >
          <option value="happy">Mutlu</option>
          <option value="sad">Hüzünlü</option>
          <option value="energetic">Enerjik</option>
          <option value="calm">Sakin</option>
        </Select>

        <Button
          colorScheme="blue"
          onClick={handleGenerate}
          isLoading={loading}
          loadingText="Üretiliyor..."
          width="full"
        >
          Müzik Üret
        </Button>

        {song && (
          <Box width="full" p={4} borderWidth={1} borderRadius="lg">
            <VStack align="start" spacing={3}>
              <Text><strong>Tarz:</strong> {song.genre}</Text>
              <Text><strong>Sözler:</strong></Text>
              <Box p={3} bg="gray.50" borderRadius="md" width="full">
                <Text whiteSpace="pre-wrap">{song.lyrics}</Text>
              </Box>
              <Text><strong>Vokaller:</strong></Text>
              <Text>Erkek: {song.vocals.male}</Text>
              <Text>Kadın: {song.vocals.female}</Text>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
}