<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function query(Request $request)
{
    $validated = $request->validate([
        'query' => 'required|string|max:1000',
    ]);
    
    // Get the query string from the validated data
    $queryText = $validated['query'];
    
    $token = "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";
    $endpoint = "https://models.github.ai/inference";
    $model = "deepseek/DeepSeek-V3-0324";
    
    try {
        // Log request for debugging
        Log::info('Making AI API request', [
            'endpoint' => $endpoint,
            'model' => $model,
            'query' => $queryText  // Use the validated query text
        ]);
        
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Content-Type' => 'application/json',
        ])->post($endpoint . '/chat/completions', [
            'messages' => [
                ['role' => 'system', 'content' => ''],
                ['role' => 'user', 'content' => $queryText],  // Use the validated query text
            ],
            'temperature' => 0.8,
            'top_p' => 0.1,
            'max_tokens' => 2048,
            'model' => $model
        ]);
        if ($response->successful()) {
            return response()->json([
                'content' => $response->json()['choices'][0]['message']['content']
            ]);
        } else {
            Log::error('AI API request failed', [
                'status' => $response->status(),
                'body' => $response->json() ?: $response->body()
            ]);
            
            return response()->json([
                'error' => 'API request failed: ' . ($response->json()['error']['message'] ?? $response->body())
            ], $response->status());
        }
    } catch (\Exception $e) {
        Log::error('Exception during AI API request', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'An error occurred: ' . $e->getMessage()
        ], 500);
    }
}
}