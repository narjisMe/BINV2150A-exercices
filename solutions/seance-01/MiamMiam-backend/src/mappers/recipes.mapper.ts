import { NewRecipe, NewRecipeDTO, Recipe, RecipeDBO, RecipeDTO } from "../models/recipe.model";

export class RecipesMapper {
  static toDTO(recipe: Recipe): RecipeDTO {
    const {
      id, title, description, imageUrl,
      prepTime, cookTime, servings, difficulty,
      categoryId, tags, ingredients, steps,
      authorId, createdAt, updatedAt
    } = recipe;

    const dto: RecipeDTO = {
      id,
      title,
      description,
      prepTime,
      cookTime,
      servings,
      difficulty,
      categoryId,
      tags,
      ingredients,
      steps,
      authorId,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };

    if (imageUrl !== undefined && imageUrl !== null) {
      dto.imageUrl = imageUrl;
    }

    return dto;
  }

  static fromNewDTO(dto: NewRecipeDTO, authorId: number): NewRecipe {
    const {
      title,
      description,
      imageUrl,
      prepTime,
      cookTime,
      servings,
      difficulty,
      categoryId,
      tags,
      ingredients,
      steps
    } = dto;
    return {
      title: title.trim(),
      description: description.trim(),
      imageUrl,
      prepTime,
      cookTime,
      servings,
      difficulty,
      categoryId,
      tags: tags ?? [],
      ingredients,
      steps,
      authorId
    };
  }

  static toDBO(recipe: Recipe): RecipeDBO {
    const {
      id, title, description, imageUrl,
      prepTime, cookTime, servings, difficulty,
      categoryId, tags, ingredients, steps,
      authorId, createdAt, updatedAt
    } = recipe;

    return {
      id,
      title,
      description,
      image_url: imageUrl,
      prep_time: prepTime,
      cook_time: cookTime,
      servings,
      difficulty,
      category_id: categoryId,
      tags,
      ingredients,
      steps,
      author_id: authorId,
      created_at: createdAt.toISOString(),
      updated_at: updatedAt.toISOString(),
    };
  }

  static fromDBO(dbo: RecipeDBO): Recipe {
    const {
      id, title, description, image_url,
      prep_time, cook_time, servings, difficulty,
      category_id, tags, ingredients, steps,
      author_id, created_at, updated_at
    } = dbo;

    return {
      id,
      title,
      description,
      imageUrl: image_url,
      prepTime: prep_time,
      cookTime: cook_time,
      servings,
      difficulty,
      categoryId: category_id,
      tags: tags ?? [],
      ingredients: ingredients ?? [],
      steps: steps ?? [],
      authorId: author_id,
      createdAt: new Date(created_at),
      updatedAt: new Date(updated_at),
    };
  }
}
