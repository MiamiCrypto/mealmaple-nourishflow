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
      grocery_list_items: {
        Row: {
          aisle: string | null
          amount: number | null
          created_at: string | null
          custom_name: string | null
          grocery_list_id: string | null
          id: string
          ingredient_id: string | null
          is_checked: boolean | null
          notes: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          aisle?: string | null
          amount?: number | null
          created_at?: string | null
          custom_name?: string | null
          grocery_list_id?: string | null
          id?: string
          ingredient_id?: string | null
          is_checked?: boolean | null
          notes?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          aisle?: string | null
          amount?: number | null
          created_at?: string | null
          custom_name?: string | null
          grocery_list_id?: string | null
          id?: string
          ingredient_id?: string | null
          is_checked?: boolean | null
          notes?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grocery_list_items_grocery_list_id_fkey"
            columns: ["grocery_list_id"]
            isOneToOne: false
            referencedRelation: "grocery_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grocery_list_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      grocery_lists: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          meal_plan_id: string | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          meal_plan_id?: string | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          meal_plan_id?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grocery_lists_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grocery_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_adjustments: {
        Row: {
          adjustment: string
          created_at: string | null
          health_condition: string
          id: string
          recipe_id: string | null
          substitutions: Json | null
          updated_at: string | null
        }
        Insert: {
          adjustment: string
          created_at?: string | null
          health_condition: string
          id?: string
          recipe_id?: string | null
          substitutions?: Json | null
          updated_at?: string | null
        }
        Update: {
          adjustment?: string
          created_at?: string | null
          health_condition?: string
          id?: string
          recipe_id?: string | null
          substitutions?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_adjustments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
          nutritional_info: Json | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
          nutritional_info?: Json | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
          nutritional_info?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      meal_plan_items: {
        Row: {
          created_at: string | null
          id: string
          is_prepared: boolean | null
          meal_plan_id: string | null
          meal_type: Database["public"]["Enums"]["meal_type"]
          notes: string | null
          recipe_id: string | null
          scheduled_date: string
          servings: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_prepared?: boolean | null
          meal_plan_id?: string | null
          meal_type: Database["public"]["Enums"]["meal_type"]
          notes?: string | null
          recipe_id?: string | null
          scheduled_date: string
          servings?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_prepared?: boolean | null
          meal_plan_id?: string | null
          meal_type?: Database["public"]["Enums"]["meal_type"]
          notes?: string | null
          recipe_id?: string | null
          scheduled_date?: string
          servings?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_items_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plan_items_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          ingredient_id: string | null
          notes: string | null
          order_index: number | null
          recipe_id: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          notes?: string | null
          order_index?: number | null
          recipe_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          notes?: string | null
          order_index?: number | null
          recipe_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cook_time: number
          created_at: string | null
          description: string | null
          dietary_tags: string[] | null
          difficulty: Database["public"]["Enums"]["recipe_difficulty"]
          external_id: string | null
          id: string
          image_url: string | null
          instructions: Json
          is_featured: boolean | null
          meal_type: Database["public"]["Enums"]["meal_type"]
          nutrition_info: Json | null
          prep_time: number
          rating: number | null
          ratings_count: number | null
          servings: number
          source: Database["public"]["Enums"]["recipe_source"]
          tags: string[] | null
          title: string
          total_time: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cook_time: number
          created_at?: string | null
          description?: string | null
          dietary_tags?: string[] | null
          difficulty?: Database["public"]["Enums"]["recipe_difficulty"]
          external_id?: string | null
          id?: string
          image_url?: string | null
          instructions: Json
          is_featured?: boolean | null
          meal_type: Database["public"]["Enums"]["meal_type"]
          nutrition_info?: Json | null
          prep_time: number
          rating?: number | null
          ratings_count?: number | null
          servings: number
          source?: Database["public"]["Enums"]["recipe_source"]
          tags?: string[] | null
          title: string
          total_time?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cook_time?: number
          created_at?: string | null
          description?: string | null
          dietary_tags?: string[] | null
          difficulty?: Database["public"]["Enums"]["recipe_difficulty"]
          external_id?: string | null
          id?: string
          image_url?: string | null
          instructions?: Json
          is_featured?: boolean | null
          meal_type?: Database["public"]["Enums"]["meal_type"]
          nutrition_info?: Json | null
          prep_time?: number
          rating?: number | null
          ratings_count?: number | null
          servings?: number
          source?: Database["public"]["Enums"]["recipe_source"]
          tags?: string[] | null
          title?: string
          total_time?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          recipe_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          allergies: string[] | null
          created_at: string | null
          dietary_preferences: string[] | null
          health_conditions: string[] | null
          id: string
          max_cooking_time: number | null
          nutrition_goals: Json | null
          preferred_meal_types:
            | Database["public"]["Enums"]["meal_type"][]
            | null
          serving_size: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          health_conditions?: string[] | null
          id?: string
          max_cooking_time?: number | null
          nutrition_goals?: Json | null
          preferred_meal_types?:
            | Database["public"]["Enums"]["meal_type"][]
            | null
          serving_size?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allergies?: string[] | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          health_conditions?: string[] | null
          id?: string
          max_cooking_time?: number | null
          nutrition_goals?: Json | null
          preferred_meal_types?:
            | Database["public"]["Enums"]["meal_type"][]
            | null
          serving_size?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recipe_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          recipe_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_recipe_interactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_recipe_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_token_usage: {
        Row: {
          created_at: string | null
          id: string
          last_reset: string
          last_updated: string | null
          month: number
          tokens_used: number
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_reset: string
          last_updated?: string | null
          month: number
          tokens_used?: number
          user_id: string
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          last_reset?: string
          last_updated?: string | null
          month?: number
          tokens_used?: number
          user_id?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      meal_type: "breakfast" | "lunch" | "dinner" | "snack"
      recipe_difficulty: "easy" | "medium" | "hard"
      recipe_source: "AI" | "Spoonacular" | "User"
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
