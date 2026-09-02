export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  user_id: string;
  created_at: string;
}

export interface GeneratedRecipe {
  title: string;
  ingredients: string[];
  instructions: string;
}
