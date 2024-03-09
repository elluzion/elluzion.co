export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      genres: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      labels: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      platforms: {
        Row: {
          accent_color: string | null
          id: number
          name: string
        }
        Insert: {
          accent_color?: string | null
          id?: number
          name: string
        }
        Update: {
          accent_color?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      release_artists: {
        Row: {
          artist_id: number
          artist_type: Database["public"]["Enums"]["artist-type"]
          id: number
          release_id: number
        }
        Insert: {
          artist_id: number
          artist_type: Database["public"]["Enums"]["artist-type"]
          id?: number
          release_id: number
        }
        Update: {
          artist_id?: number
          artist_type?: Database["public"]["Enums"]["artist-type"]
          id?: number
          release_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_release_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_release_artists_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          }
        ]
      }
      release_downloads: {
        Row: {
          created_at: string
          download_url: string
          edit: Database["public"]["Enums"]["song-edit"]
          format: Database["public"]["Enums"]["audio-filetype"]
          id: number
          release_id: number
        }
        Insert: {
          created_at?: string
          download_url: string
          edit: Database["public"]["Enums"]["song-edit"]
          format: Database["public"]["Enums"]["audio-filetype"]
          id?: number
          release_id: number
        }
        Update: {
          created_at?: string
          download_url?: string
          edit?: Database["public"]["Enums"]["song-edit"]
          format?: Database["public"]["Enums"]["audio-filetype"]
          id?: number
          release_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_release_downloads_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          }
        ]
      }
      release_links: {
        Row: {
          id: number
          platform_id: number | null
          release_id: number
          url: string
        }
        Insert: {
          id?: number
          platform_id?: number | null
          release_id: number
          url: string
        }
        Update: {
          id?: number
          platform_id?: number | null
          release_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_release_links_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_release_links_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          }
        ]
      }
      release_types: {
        Row: {
          id: number
          title: string
        }
        Insert: {
          id?: number
          title: string
        }
        Update: {
          id?: number
          title?: string
        }
        Relationships: []
      }
      releases: {
        Row: {
          art_url: string | null
          created_at: string
          description: string | null
          genre_id: number | null
          id: number
          key: string | null
          label_id: number | null
          release_date: string
          release_type_id: number | null
          tempo: number | null
          title: string
          written_id: string
        }
        Insert: {
          art_url?: string | null
          created_at?: string
          description?: string | null
          genre_id?: number | null
          id?: number
          key?: string | null
          label_id?: number | null
          release_date: string
          release_type_id?: number | null
          tempo?: number | null
          title: string
          written_id: string
        }
        Update: {
          art_url?: string | null
          created_at?: string
          description?: string | null
          genre_id?: number | null
          id?: number
          key?: string | null
          label_id?: number | null
          release_date?: string
          release_type_id?: number | null
          tempo?: number | null
          title?: string
          written_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_releases_genre_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_releases_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_releases_release_type_id_fkey"
            columns: ["release_type_id"]
            isOneToOne: false
            referencedRelation: "release_types"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      "artist-type": "main" | "feature" | "remixer"
      "audio-filetype": "mp3" | "wav"
      "song-edit": "regular" | "extended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
