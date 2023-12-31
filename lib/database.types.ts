export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      alert: {
        Row: {
          active: boolean;
          alert_type: string;
          created_at: string;
          id: number;
          message: string | null;
          phone_numbers: string[];
          region: Database['public']['Enums']['region'];
          send_email: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          alert_type: string;
          created_at?: string;
          id?: number;
          message?: string | null;
          phone_numbers?: string[];
          region?: Database['public']['Enums']['region'];
          send_email?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          alert_type?: string;
          created_at?: string;
          id?: number;
          message?: string | null;
          phone_numbers?: string[];
          region?: Database['public']['Enums']['region'];
          send_email?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'alert_alert_type_fkey';
            columns: ['alert_type'];
            referencedRelation: 'alert_type';
            referencedColumns: ['name'];
          },
          {
            foreignKeyName: 'alert_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      alert_type: {
        Row: {
          created_at: string;
          description: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_notification: {
        Row: {
          created_at: string;
          from: string;
          html: string;
          id: string;
          status: Database['public']['Enums']['email_notification_status'];
          subject: string;
          to: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          from: string;
          html: string;
          id?: string;
          status?: Database['public']['Enums']['email_notification_status'];
          subject: string;
          to: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          from?: string;
          html?: string;
          id?: string;
          status?: Database['public']['Enums']['email_notification_status'];
          subject?: string;
          to?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'email_notification_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      in_app_notification: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          level: Database['public']['Enums']['notification_level'];
          read: boolean;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          level?: Database['public']['Enums']['notification_level'];
          read?: boolean;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          level?: Database['public']['Enums']['notification_level'];
          read?: boolean;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'in_app_notification_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      realtime_system_demand: {
        Row: {
          created_at: string;
          event_time: string;
          value: number;
        };
        Insert: {
          created_at?: string;
          event_time: string;
          value: number;
        };
        Update: {
          created_at?: string;
          event_time?: string;
          value?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      comparator: 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte';
      email_notification_status: 'pending' | 'success' | 'error';
      notification_level: 'info' | 'warn' | 'error';
      region: 'ROI' | 'NI' | 'ALL';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'buckets_owner_fkey';
            columns: ['owner'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
