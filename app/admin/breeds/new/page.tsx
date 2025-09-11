import BreedForm from '@/components/admin/breed-form';

export default function NewBreedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Breed</h1>
        <p className="text-gray-600">Create a new dog breed entry in the database</p>
      </div>
      
      <BreedForm />
    </div>
  );
}