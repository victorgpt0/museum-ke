<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArtifactRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:category,id',
            'condition' => 'required|in:good,poor',
            'location' => 'nullable|string|max:255',
            'acquisition_date' => 'nullable|date',
            'status' => 'required|string|max:50',
            'donor_id' => 'nullable|exists:donors,id',
            'images.*' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:10240',
            'documents.*' => 'nullable|file|mimes:pdf,docx|max:10240',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'The artifact title is required.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'The selected category is invalid.',
            'condition.required' => 'Please select the artifact condition.',
            'condition.in' => 'The condition must be either good or poor.',
            'status.required' => 'Please select a status.',
            'donor_id.exists' => 'The selected donor is invalid.',
            'images.*.mimes' => 'Images must be in JPG, JPEG, PNG, or WebP format.',
            'images.*.max' => 'Images must not exceed 10MB.',
            'documents.*.mimes' => 'Documents must be in PDF or DOCX format.',
            'documents.*.max' => 'Documents must not exceed 10MB.',
            'tags.*.exists' => 'One or more selected tags are invalid.',
        ];
    }
}
