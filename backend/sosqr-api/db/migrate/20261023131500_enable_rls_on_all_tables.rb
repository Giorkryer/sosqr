class EnableRlsOnAllTables < ActiveRecord::Migration[8.1]
  def up
    execute <<-SQL
      -- 1. Habilita RLS em todas as tabelas do schema public (elimina os alertas críticos do Supabase)
      ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.ar_internal_metadata ENABLE ROW LEVEL SECURITY;

      -- 2. Políticas de segurança para a tabela patients
      DROP POLICY IF EXISTS "Cuidadores gerenciam seus proprios pacientes" ON public.patients;
      CREATE POLICY "Cuidadores gerenciam seus proprios pacientes"
      ON public.patients FOR ALL
      TO authenticated
      USING (auth.uid()::text = user_id OR auth.uid()::text = clerk_user_id)
      WITH CHECK (auth.uid()::text = user_id OR auth.uid()::text = clerk_user_id);

      -- 3. Políticas de segurança para a tabela emergency_contacts
      DROP POLICY IF EXISTS "Cuidadores gerenciam contatos de seus pacientes" ON public.emergency_contacts;
      CREATE POLICY "Cuidadores gerenciam contatos de seus pacientes"
      ON public.emergency_contacts FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.patients
          WHERE patients.id = emergency_contacts.patient_id
            AND (patients.user_id = auth.uid()::text OR patients.clerk_user_id = auth.uid()::text)
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.patients
          WHERE patients.id = emergency_contacts.patient_id
            AND (patients.user_id = auth.uid()::text OR patients.clerk_user_id = auth.uid()::text)
        )
      );

      -- 4. Políticas de segurança para a tabela scan_logs
      DROP POLICY IF EXISTS "Cuidadores leem scan_logs de seus pacientes" ON public.scan_logs;
      CREATE POLICY "Cuidadores leem scan_logs de seus pacientes"
      ON public.scan_logs FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.patients
          WHERE patients.id = scan_logs.patient_id
            AND (patients.user_id = auth.uid()::text OR patients.clerk_user_id = auth.uid()::text)
        )
      );
    SQL
  end

  def down
    execute <<-SQL
      DROP POLICY IF EXISTS "Cuidadores gerenciam seus proprios pacientes" ON public.patients;
      DROP POLICY IF EXISTS "Cuidadores gerenciam contatos de seus pacientes" ON public.emergency_contacts;
      DROP POLICY IF EXISTS "Cuidadores leem scan_logs de seus pacientes" ON public.scan_logs;

      ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.emergency_contacts DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.scan_logs DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.schema_migrations DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.ar_internal_metadata DISABLE ROW LEVEL SECURITY;
    SQL
  end
end
