import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { RecommendationEngine, type Breed } from '@/lib/recommendation-engine';
import type { QuestionnaireData } from '@/components/questionnaire';

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get questionnaire answers from request body
    const answers: QuestionnaireData = await request.json();
    
    // Validate required fields
    if (!answers.livingSituation || !answers.activityLevel || !answers.experienceLevel) {
      return NextResponse.json(
        { error: 'Missing required questionnaire data' },
        { status: 400 }
      );
    }

    // Fetch all breeds from database
    const { data: breeds, error } = await supabase
      .from('breeds')
      .select('*');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch breeds from database' },
        { status: 500 }
      );
    }

    if (!breeds || breeds.length === 0) {
      return NextResponse.json(
        { error: 'No breeds found in database' },
        { status: 404 }
      );
    }

    // Calculate breed matches using recommendation engine
    const matches = RecommendationEngine.calculateBreedMatches(answers, breeds as Breed[]);

    // Return top 20 matches (you can adjust this number)
    const topMatches = matches.slice(0, 20);

    return NextResponse.json({
      success: true,
      matches: topMatches,
      totalBreeds: breeds.length,
      questionnaire: answers
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  try {
    const supabase = await supabaseServer();
    
    // Get breed count for health check
    const { count, error } = await supabase
      .from('breeds')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json(
        { error: 'Database connection failed', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Recommendations API is working',
      breedCount: count,
      endpoints: {
        POST: '/api/recommendations - Submit questionnaire for breed recommendations'
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'API health check failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}