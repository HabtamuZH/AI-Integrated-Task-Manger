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
      achievements: {
        Row: {
          date: string
          description: string
          id: string
          title: string
          unlocked: boolean
          userid: string
        }
        Insert: {
          date?: string
          description: string
          id?: string
          title: string
          unlocked?: boolean
          userid: string
        }
        Update: {
          date?: string
          description?: string
          id?: string
          title?: string
          unlocked?: boolean
          userid?: string
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          category: string
          createdat: string
          description: string
          duedate: string | null
          estimatedtime: string | null
          id: string
          priority: string
          title: string
          userid: string
        }
        Insert: {
          category: string
          createdat?: string
          description: string
          duedate?: string | null
          estimatedtime?: string | null
          id?: string
          priority: string
          title: string
          userid: string
        }
        Update: {
          category?: string
          createdat?: string
          description?: string
          duedate?: string | null
          estimatedtime?: string | null
          id?: string
          priority?: string
          title?: string
          userid?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed: boolean
          createdat: string
          description: string | null
          duedate: string
          id: string
          priority: string
          title: string
          updatedat: string
          userid: string
        }
        Insert: {
          completed?: boolean
          createdat?: string
          description?: string | null
          duedate: string
          id?: string
          priority: string
          title: string
          updatedat?: string
          userid: string
        }
        Update: {
          completed?: boolean
          createdat?: string
          description?: string | null
          duedate?: string
          id?: string
          priority?: string
          title?: string
          updatedat?: string
          userid?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          bio: string | null
          createdat: string
          email: string
          id: string
          joindate: string
          location: string | null
          name: string
          phone: string | null
          updatedat: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          createdat?: string
          email: string
          id: string
          joindate?: string
          location?: string | null
          name: string
          phone?: string | null
          updatedat?: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          createdat?: string
          email?: string
          id?: string
          joindate?: string
          location?: string | null
          name?: string
          phone?: string | null
          updatedat?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          table_schema: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
