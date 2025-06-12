<?php

if (!function_exists('relative_route')) {
    function relative_route($url){
        $base = config('app.url');
        $parsed = parse_url($url);
        $baseParsed = parse_url($base);

        // If same host, return relative path
        if (($parsed['host'] ?? null) === ($baseParsed['host'] ?? null)) {
            $path = $parsed['path'] ?? '/';
            $query = isset($parsed['query']) ? '?'.$parsed['query'] : '';
            $fragment = isset($parsed['fragment']) ? '#'.$parsed['fragment'] : '';
            return $path.$query.$fragment;
        }

        // External URL, return as-is
        return $url;
    }
}
