"use client";

import { useState, useCallback, type FormEvent } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smile, Image as ImageIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface TenorGif {
  id: string;
  media_formats: {
    gif: {
      url: string;
    };
    tinygif: {
      url: string;
      dims: number[];
    };
  };
  content_description: string;
}

interface TenorResponse {
  results: TenorGif[];
}

const TENOR_API_KEY = process.env.NEXT_PUBLIC_TENOR_API_KEY;
const TENOR_CLIENT_KEY = "chat-app";

interface EmojiGifPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onGifSelect: (gifUrl: string) => void;
}

export const EmojiGifPicker = ({
  onEmojiSelect,
  onGifSelect,
}: EmojiGifPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState<TenorGif[]>([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
  };

  const handleGifClick = (gifUrl: string) => {
    onGifSelect(gifUrl);
    setIsOpen(false);
  };

  const fetchGifs = useCallback(async (query: string = "") => {
    setIsLoadingGifs(true);
    try {
      if (!TENOR_API_KEY) {
        console.error(
          "Missing NEXT_PUBLIC_TENOR_API_KEY. Set it in .env.local to enable GIF search."
        );
        setGifs([]);
        return;
      }

      const endpoint = query
        ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
            query
          )}&key=${TENOR_API_KEY}&client_key=${TENOR_CLIENT_KEY}&limit=20`
        : `https://tenor.googleapis.com/v2/featured?key=${TENOR_API_KEY}&client_key=${TENOR_CLIENT_KEY}&limit=20`;

      const response = await fetch(endpoint);
      const data: TenorResponse = await response.json();
      setGifs(data.results || []);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      setGifs([]);
    } finally {
      setIsLoadingGifs(false);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchGifs(searchTerm);
  };

  // Load trending GIFs when GIF tab is opened
  const handleTabChange = (value: string) => {
    if (value === "gif" && gifs.length === 0) {
      fetchGifs();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="shrink-0">
          <Smile className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-87.5 p-0" align="end">
        <Tabs
          defaultValue="emoji"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emoji" className="gap-2">
              <Smile className="size-4" />
              Emoji
            </TabsTrigger>
            <TabsTrigger value="gif" className="gap-2">
              <ImageIcon className="size-4" />
              GIF
            </TabsTrigger>
          </TabsList>
          <TabsContent value="emoji" className="p-0">
            <EmojiPicker
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              theme={"dark" as any}
              onEmojiClick={handleEmojiClick}
              width="100%"
              height={350}
              searchDisabled={false}
              skinTonesDisabled={false}
              previewConfig={{
                showPreview: false,
              }}
            />
          </TabsContent>
          <TabsContent value="gif" className="p-2">
            <div className="space-y-2">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <Input
                  placeholder="Search GIFs..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" variant="secondary">
                  <Search className="size-4" />
                </Button>
              </form>
              <ScrollArea className="h-[300px]">
                {isLoadingGifs ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">
                      Loading GIFs...
                    </p>
                  </div>
                ) : gifs.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">
                      No GIFs found
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {gifs.map((gif) => (
                      <button
                        key={gif.id}
                        type="button"
                        onClick={() =>
                          handleGifClick(gif.media_formats.gif.url)
                        }
                        className="relative aspect-square overflow-hidden rounded-md hover:opacity-80 transition-opacity"
                      >
                        <Image
                          unoptimized
                          height={200}
                          width={200}
                          src={gif.media_formats.tinygif.url}
                          alt={gif.content_description}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
