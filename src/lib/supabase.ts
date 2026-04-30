/// <reference types="vite/client" />

// Pure mock implementation of Supabase client to ensure 100% offline functionality.
// This removes all external dependencies and environment variable requirements.

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithOtp: async () => ({ data: {}, error: null }),
    verifyOtp: async () => ({ data: { user: { id: 'mock-user' } }, error: null }),
    signOut: async () => {
      console.log('Mock: Global sign out');
      return { error: null };
    },
    updateUser: async (data: any) => {
      console.log('Mock: User update', data);
      return { data: { user: { id: 'mock-user', ...data } }, error: null };
    },
    getUser: async () => ({ data: { user: { id: 'mock-user', email: 'user@example.com' } }, error: null })
  },
  from: (table: string) => ({
    select: () => ({
      order: () => ({
        then: (resolve: any) => {
          if (table === 'payments') {
            resolve({
              data: [
                { id: 'SUR-77291-B', date: '2024-04-28', amount: '$499.00', status: 'Paid', plan: 'Elite Recovery', receipt_url: '#' },
                { id: 'SUR-76120-A', date: '2024-03-15', amount: '$199.00', status: 'Paid', plan: 'Essential Care', receipt_url: '#' },
                { id: 'CON-12093-X', date: '2024-01-10', amount: '$49.00', status: 'Paid', plan: 'Initial Consult', receipt_url: '#' },
                { id: 'PAY-WAI-992', date: '2024-05-02', amount: '$299.00', status: 'Pending', plan: 'Post-Op Rehab', receipt_url: null }
              ],
              error: null
            });
          } else {
            resolve({ data: [], error: null });
          }
        }
      }),
      then: (resolve: any) => resolve({ data: [], error: null })
    }),
    insert: () => ({
      then: (resolve: any) => resolve({ data: [], error: null })
    }),
    update: () => ({
      eq: () => ({
        then: (resolve: any) => resolve({ data: [], error: null })
      })
    }),
    delete: () => ({
      eq: () => ({
        then: (resolve: any) => resolve({ data: [], error: null })
      })
    })
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: { path: 'mock-path' }, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: 'https://placeholder.com/image.png' } })
    })
  }
} as any;
