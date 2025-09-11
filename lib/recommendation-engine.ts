import { QuestionnaireData } from '@/components/questionnaire';

export interface Breed {
  id: string;
  name: string;
  size: string;
  // Some admin pages use 'breed_group' while public pages use 'group'. Keep both for compatibility.
  breed_group?: string;
  energy_level: number;
  good_with_kids: number;
  training_ease: number;
  grooming_needs: number;
  barking_level: number;
  shedding_level: number;
  temperament: string;
  exercise_needs: string;
  grooming: string;
  training: string;
  origin: string;
  group: string;
  apartment_friendly: number;
  good_with_pets: number;
  description: string;
  weight_min: number;
  weight_max: number;
  breed_type: string;
  popularity_rank: number;
  data_source: string;
  last_updated: any;
  height_min: number;
  height_max: number;
  lifespan_min: number;
  lifespan_max: number;
  drooling_tendency: number;
  separation_anxiety_risk: number;
  climate_suitability: number;
  noise_sensitivity: number;
  monthly_cost_aud: number;
  coat_type: string;
  image_url: string;
  lifespan: string;
  shedding_description: string;
}

export interface BreedMatch extends Breed {
  matchPercentage: number;
  matchReasons: string[];
}

export class RecommendationEngine {
  
  // Weighted scoring percentages from README2
  private static readonly WEIGHTS = {
    LIVING_SITUATION: 0.20,    // 20%
    ACTIVITY_LEVEL: 0.25,      // 25%
    EXPERIENCE_LEVEL: 0.15,    // 15%
    FAMILY_FACTORS: 0.25,      // 25% (kids + pets)
    PREFERENCES: 0.15          // 15% (size + grooming)
  };

  /**
   * Main recommendation function
   */
  static calculateBreedMatches(answers: QuestionnaireData, breeds: Breed[]): BreedMatch[] {
    const matches = breeds.map(breed => {
      const scores = this.calculateIndividualScores(answers, breed);
      const matchPercentage = this.calculateOverallMatch(scores);
      const matchReasons = this.generateMatchReasons(answers, breed, scores);

      return {
        ...breed,
        matchPercentage,
        matchReasons
      };
    });

    // Sort by match percentage (highest first)
    return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  /**
   * Calculate individual category scores (0-1)
   */
  private static calculateIndividualScores(answers: QuestionnaireData, breed: Breed) {
    return {
      livingScore: this.scoreLivingSituation(answers.livingSituation, breed),
      activityScore: this.scoreActivityLevel(answers.activityLevel, breed),
      experienceScore: this.scoreExperienceLevel(answers.experienceLevel, breed),
      familyScore: this.scoreFamilyFactors(answers, breed),
      preferencesScore: this.scorePreferences(answers, breed)
    };
  }

  /**
   * Living Situation Scoring (20% weight)
   */
  private static scoreLivingSituation(livingSituation: string, breed: Breed): number {
    const apartmentFriendly = breed.apartment_friendly || 3;
    const size = breed.size?.toLowerCase() || '';

    switch (livingSituation) {
      case 'apartment':
        // High score for apartment-friendly breeds
        if (apartmentFriendly >= 4) return 1.0;
        if (apartmentFriendly >= 3) return 0.7;
        return 0.3;
      
      case 'house':
        // Good for most breeds, slight preference for medium/large
        if (size.includes('medium') || size.includes('large')) return 1.0;
        return 0.8;
      
      case 'farm':
        // Best for large, high-energy working breeds
        if (size.includes('large') && (breed.energy_level || 0) >= 4) return 1.0;
        if (breed.energy_level >= 3) return 0.8;
        return 0.6;
      
      default:
        return 0.5;
    }
  }

  /**
   * Activity Level Scoring (25% weight)
   */
  private static scoreActivityLevel(activityLevel: string, breed: Breed): number {
    const breedEnergyLevel = breed.energy_level || 3;

    switch (activityLevel) {
      case 'low':
        // Prefer low-energy breeds (1-2)
        if (breedEnergyLevel <= 2) return 1.0;
        if (breedEnergyLevel === 3) return 0.6;
        return 0.2;
      
      case 'moderate':
        // Prefer moderate-energy breeds (2-4)
        if (breedEnergyLevel >= 2 && breedEnergyLevel <= 4) return 1.0;
        if (breedEnergyLevel === 1 || breedEnergyLevel === 5) return 0.6;
        return 0.3;
      
      case 'high':
        // Prefer high-energy breeds (4-5)
        if (breedEnergyLevel >= 4) return 1.0;
        if (breedEnergyLevel === 3) return 0.6;
        return 0.2;
      
      default:
        return 0.5;
    }
  }

  /**
   * Experience Level Scoring (15% weight)
   */
  private static scoreExperienceLevel(experienceLevel: string, breed: Breed): number {
    const trainingEase = breed.training_ease || 3;

    switch (experienceLevel) {
      case 'beginner':
        // Prefer easy-to-train breeds (4-5)
        if (trainingEase >= 4) return 1.0;
        if (trainingEase === 3) return 0.6;
        return 0.3;
      
      case 'some':
        // Good with most breeds
        if (trainingEase >= 3) return 1.0;
        return 0.7;
      
      case 'expert':
        // Can handle any breed, slight preference for challenging ones
        if (trainingEase <= 2) return 1.0;
        return 0.9;
      
      default:
        return 0.5;
    }
  }

  /**
   * Family Factors Scoring (25% weight - split between kids and pets)
   */
  private static scoreFamilyFactors(answers: QuestionnaireData, breed: Breed): number {
    const kidsScore = this.scoreKidsCompatibility(answers.hasKids, breed);
    const petsScore = this.scorePetsCompatibility(answers.otherPets, breed);
    
    // Equal weight between kids and pets within family factors
    return (kidsScore + petsScore) / 2;
  }

  private static scoreKidsCompatibility(hasKids: string, breed: Breed): number {
    const goodWithKids = breed.good_with_kids || 3;

    switch (hasKids) {
      case 'none':
        return 1.0; // No kids = no restriction
      
      case 'young':
        // Young kids need very kid-friendly breeds
        if (goodWithKids >= 4) return 1.0;
        if (goodWithKids === 3) return 0.5;
        return 0.2;
      
      case 'older':
        // Older kids are more flexible
        if (goodWithKids >= 3) return 1.0;
        return 0.6;
      
      case 'both':
        // Mixed ages need very kid-friendly breeds
        if (goodWithKids >= 4) return 1.0;
        if (goodWithKids === 3) return 0.6;
        return 0.3;
      
      default:
        return 0.5;
    }
  }

  private static scorePetsCompatibility(otherPets: string, breed: Breed): number {
    const goodWithPets = breed.good_with_pets || 3;

    switch (otherPets) {
      case 'none':
        return 1.0; // No other pets = no restriction
      
      case 'dogs':
      case 'cats':
      case 'mixed':
        // Any other pets need pet-friendly breeds
        if (goodWithPets >= 4) return 1.0;
        if (goodWithPets === 3) return 0.7;
        return 0.3;
      
      default:
        return 0.5;
    }
  }

  /**
   * Preferences Scoring (15% weight - grooming tolerance)
   */
  private static scorePreferences(answers: QuestionnaireData, breed: Breed): number {
    const groomingNeeds = breed.grooming_needs || 3;

    switch (answers.groomingTolerance) {
      case 'minimal':
        // Prefer low-maintenance breeds
        if (groomingNeeds <= 2) return 1.0;
        if (groomingNeeds === 3) return 0.6;
        return 0.2;
      
      case 'moderate':
        // Good with moderate grooming
        if (groomingNeeds >= 2 && groomingNeeds <= 4) return 1.0;
        return 0.6;
      
      case 'high':
        // Can handle high-maintenance breeds
        if (groomingNeeds >= 4) return 1.0;
        return 0.8;
      
      default:
        return 0.5;
    }
  }

  /**
   * Calculate overall match percentage using weighted scores
   */
  private static calculateOverallMatch(scores: any): number {
    const weightedScore = 
      (scores.livingScore * this.WEIGHTS.LIVING_SITUATION) +
      (scores.activityScore * this.WEIGHTS.ACTIVITY_LEVEL) +
      (scores.experienceScore * this.WEIGHTS.EXPERIENCE_LEVEL) +
      (scores.familyScore * this.WEIGHTS.FAMILY_FACTORS) +
      (scores.preferencesScore * this.WEIGHTS.PREFERENCES);

    return Math.round(weightedScore * 100);
  }

  /**
   * Generate human-readable match reasons
   */
  private static generateMatchReasons(answers: QuestionnaireData, breed: Breed, scores: any): string[] {
    const reasons: string[] = [];

    if (scores.livingScore >= 0.8) {
      reasons.push(`Great fit for your ${answers.livingSituation} living situation`);
    }

    if (scores.activityScore >= 0.8) {
      reasons.push(`Matches your ${answers.activityLevel} activity level perfectly`);
    }

    if (scores.familyScore >= 0.8) {
      if (answers.hasKids !== 'none') {
        reasons.push('Excellent with children');
      }
      if (answers.otherPets !== 'none') {
        reasons.push('Gets along well with other pets');
      }
    }

    if (scores.experienceScore >= 0.8) {
      if (answers.experienceLevel === 'beginner') {
        reasons.push('Easy to train for first-time owners');
      } else {
        reasons.push('Suitable for your experience level');
      }
    }

    if (scores.preferencesScore >= 0.8) {
      reasons.push(`Low maintenance grooming fits your ${answers.groomingTolerance} tolerance`);
    }

    return reasons;
  }

  /**
   * Get match color based on percentage (from README2)
   */
  static getMatchColor(percentage: number): string {
    if (percentage >= 90) return 'text-green-600';  // Excellent match
    if (percentage >= 75) return 'text-yellow-600'; // Good match
    return 'text-orange-600';                       // Fair match
  }

  /**
   * Get match label based on percentage
   */
  static getMatchLabel(percentage: number): string {
    if (percentage >= 90) return 'Excellent Match';
    if (percentage >= 75) return 'Good Match';
    if (percentage >= 60) return 'Fair Match';
    return 'Low Match';
  }
}