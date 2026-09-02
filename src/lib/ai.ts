import { supabase } from '@/lib/supabase';

export async function generateRecipe(ingredients: string[]) {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-recipe`;
  const { data: session } = await supabase.auth.getSession();
  const accessToken = session.session?.access_token;

  if (!accessToken) {
    throw new Error('You must be logged in to generate a recipe.');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ ingredients }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed (${response.status})`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.title || !data.ingredients || !data.instructions) {
    throw new Error('Incomplete recipe received. Please try again.');
  }

  return {
    title: data.title as string,
    ingredients: data.ingredients as string[],
    instructions: data.instructions as string,
  };
}
