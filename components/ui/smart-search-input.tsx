'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    POPULAR_SEARCHES,
    SEARCH_EXAMPLES,
    SearchSuggestion,
    generateSearchSuggestions,
    getRecentSearches,
    parseSearchIntent,
    saveRecentSearch
} from '@/lib/semantic-search';
import { cn } from '@/lib/utils';
import { Building2, Clock, MapPin, Search, TrendingUp, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SmartSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  context?: {
    assets?: Array<{ name: string; assetNumber: string; location: string }>;
    purposes?: Array<{ name: string; description: string }>;
  };
}

const SUGGESTION_ICONS = {
  asset: Building2,
  purpose: Zap,
  location: MapPin,
  action: TrendingUp,
  recent: Clock,
};

export function SmartSearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Search assets...",
  disabled = false,
  loading = false,
  className,
  context,
}: SmartSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Generate suggestions based on input
  useEffect(() => {
    if (!isOpen || !value.trim()) {
      setSuggestions(generateSearchSuggestions('', {
        recentSearches,
        popularSearches: POPULAR_SEARCHES,
        assets: context?.assets,
        purposes: context?.purposes,
      }));
      return;
    }

    const newSuggestions = generateSearchSuggestions(value, {
      recentSearches,
      popularSearches: POPULAR_SEARCHES,
      assets: context?.assets,
      purposes: context?.purposes,
    });

    setSuggestions(newSuggestions);
  }, [value, isOpen, recentSearches, context]);

  // Handle input focus
  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Handle input blur with delay to allow clicks on suggestions
  const handleBlur = useCallback(() => {
    setTimeout(() => setIsOpen(false), 150);
  }, []);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    const searchQuery = suggestion.text;
    onChange(searchQuery);
    setIsOpen(false);
    setSelectedIndex(-1);

    // Save to recent searches
    saveRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());

    // Trigger search
    onSearch(searchQuery);

    // Focus back to input
    inputRef.current?.focus();
  }, [onChange, onSearch]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        onSearch(value);
        saveRecentSearch(value);
        setRecentSearches(getRecentSearches());
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          onSearch(value);
          saveRecentSearch(value);
          setRecentSearches(getRecentSearches());
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, suggestions, selectedIndex, handleSuggestionSelect, value, onSearch]);

  // Parse search intent for smart suggestions
  const searchIntent = value.trim() ? parseSearchIntent(value) : null;

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="pl-10 pr-20"
            />
            <Button
              onClick={() => {
                onSearch(value);
                saveRecentSearch(value);
                setRecentSearches(getRecentSearches());
              }}
              disabled={disabled || loading}
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="text-white" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </PopoverTrigger>

        {/* Search Intent Indicator */}
        {searchIntent && searchIntent.confidence > 0.6 && (
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {searchIntent.action} intent detected
            </Badge>
            {searchIntent.entities.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {searchIntent.entities.length} entities found
              </Badge>
            )}
          </div>
        )}

        {/* Suggestions Dropdown */}
        <PopoverContent
          className="w-full p-0"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <ScrollArea className="max-h-80">
            <div ref={suggestionsRef} className="p-2">
                {suggestions.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start typing to search assets...</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Try these examples:</p>
                      {SEARCH_EXAMPLES.slice(0, 3).map((example, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionSelect({
                            id: `example-${index}`,
                            text: example,
                            type: 'action',
                          })}
                          className="block w-full text-left text-xs text-muted-foreground hover:text-foreground p-1 rounded"
                        >
                          &ldquo;{example}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Suggestions by category */}
                    {Object.entries(
                      suggestions.reduce((acc, suggestion) => {
                        const category = suggestion.category || 'Other';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(suggestion);
                        return acc;
                      }, {} as Record<string, SearchSuggestion[]>)
                    ).map(([category, categorySuggestions]) => (
                      <div key={category}>
                        <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                          {category}
                        </div>
                        {categorySuggestions.map((suggestion, index) => {
                          const globalIndex = suggestions.indexOf(suggestion);
                          const Icon = SUGGESTION_ICONS[suggestion.type] || Search;

                          return (
                            <button
                              key={suggestion.id}
                              onClick={() => handleSuggestionSelect(suggestion)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 transition-colors",
                                selectedIndex === globalIndex && "bg-muted"
                              )}
                            >
                              <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {suggestion.text}
                                </div>
                                {suggestion.metadata?.description && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {suggestion.metadata.description}
                                  </div>
                                )}
                              </div>
                              {suggestion.type === 'recent' && (
                                <Clock className="h-3 w-3 text-muted-foreground" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
