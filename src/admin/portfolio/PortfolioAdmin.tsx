import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Upload,
  Trash2,
  Image,
  Edit,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { PortfolioService } from "@/data/portfolioService";
import type { PortfolioPage, PortfolioItem } from "@/data/portfolioTypes";
import { TagInput } from "@/components/ui/tag-input";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Fixed list of pages a portfolio item can be assigned to
const PAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "custom-booth", label: "Custom Booth Design And Build" },
  { value: "modular-booth", label: "Modular Booth Design And Build" },
  { value: "pavilion", label: "Pavilion Design & Build" },
  { value: "double-decker", label: "Double Decker Exhibition Stands" },
];

type CountryOption = { slug: string; name: string };
type CityOption = { country_slug: string; city_slug: string; name: string };

// Inline multi-select dropdown for picking multiple pages
function MultiSelectPages({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (slug: string) => {
    if (value.includes(slug)) {
      onChange(value.filter((v) => v !== slug));
    } else {
      onChange([...value, slug]);
    }
  };

  const labelText =
    value.length === 0
      ? "Select pages"
      : value.length === 1
      ? PAGE_OPTIONS.find((p) => p.value === value[0])?.label || "1 selected"
      : `${value.length} selected`;

  return (
    <div className="relative w-full" ref={ref}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        className={cn(
          "w-full justify-between text-left font-normal h-9",
          value.length === 0 && "text-muted-foreground"
        )}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">{labelText}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform shrink-0 ml-2",
            open && "rotate-180"
          )}
        />
      </Button>
      {open && (
        <div className="absolute z-50 mt-1 w-64 max-w-[calc(100vw-2rem)] rounded-md border bg-popover text-popover-foreground shadow-md right-0">
          <div className="max-h-60 overflow-auto py-1">
            {PAGE_OPTIONS.map((opt) => {
              const checked = value.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function PortfolioAdmin() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [portfolio, setPortfolio] = useState<PortfolioPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Form fields
  const [heroTitle, setHeroTitle] = useState("");
  const [heroBackgroundImageAlt, setHeroBackgroundImageAlt] = useState("");
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [portfolioSubtitle, setPortfolioSubtitle] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywordsArray, setSeoKeywordsArray] = useState<string[]>([]);

  // New item form
  const [newItemImage, setNewItemImage] = useState("");
  const [newItemAlt, setNewItemAlt] = useState("");

  // Edit item dialog
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingItemAlt, setEditingItemAlt] = useState("");

  // Countries / cities (for per-item location selection)
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);

  // Calculate total pages for pagination
  const totalPages = useMemo(() => {
    if (!portfolio?.items) return 0;
    return Math.ceil(portfolio.items.length / pageSize);
  }, [portfolio?.items, pageSize]);

  // Get current page items
  const currentItems = useMemo(() => {
    if (!portfolio?.items) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return portfolio.items.slice(startIndex, endIndex);
  }, [portfolio?.items, currentPage, pageSize]);

  // Load portfolio data
  useEffect(() => {
    loadPortfolioData();
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const [countriesRes, citiesRes] = await Promise.all([
        supabase
          .from("countries")
          .select("slug, name")
          .eq("is_active", true)
          .order("name"),
        supabase
          .from("cities")
          .select("country_slug, city_slug, name")
          .eq("is_active", true)
          .order("name"),
      ]);

      if (!countriesRes.error && countriesRes.data) {
        setCountries(
          (countriesRes.data as CountryOption[]).map((c) => ({
            slug: c.slug,
            name: (c.name || "").trim(),
          }))
        );
      }
      if (!citiesRes.error && citiesRes.data) {
        setCities(
          (citiesRes.data as CityOption[]).map((c) => ({
            country_slug: c.country_slug,
            city_slug: c.city_slug,
            name: (c.name || "").trim(),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load countries/cities", err);
    }
  };

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const { data, error } = await PortfolioService.getPortfolioPage();

      if (error) {
        setError(error);
        return;
      }

      if (data) {
        setPortfolio(data);
        setHeroTitle(data.hero.title);
        setHeroBackgroundImageAlt(data.hero.backgroundImageAlt || "");
        setPortfolioTitle(data.portfolio.title);
        setPortfolioSubtitle(data.portfolio.subtitle);
        setSeoTitle(data.seo.title);
        setSeoDescription(data.seo.description);
        setSeoKeywordsArray(
          data.seo.keywords
            ? data.seo.keywords
                .split(",")
                .map((k) => k.trim())
                .filter((k) => k)
            : []
        );
      }
    } catch (err) {
      setError("Failed to load portfolio data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!portfolio) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updatedData = {
        hero: {
          title: heroTitle,
          backgroundImage: portfolio.hero.backgroundImage, // Keep existing background image
          backgroundImageAlt: heroBackgroundImageAlt,
        },
        portfolio: {
          title: portfolioTitle,
          subtitle: portfolioSubtitle,
        },
        seo: {
          title: seoTitle,
          description: seoDescription,
          keywords: seoKeywordsArray.join(", "),
        },
      };

      const { error } = await PortfolioService.updatePortfolioPage(updatedData);

      if (error) {
        setError(error);
      } else {
        setSuccess("Portfolio updated successfully");
        loadPortfolioData(); // Reload to get updated data
      }
    } catch (err) {
      setError("Failed to update portfolio");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemImage) {
      setError("Please provide an image");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Always set featured to false since we're removing this functionality
      const newItem: PortfolioItem = {
        image: newItemImage,
        featured: false,
      };

      const { error: addItemError } = await PortfolioService.addPortfolioItem(
        newItem
      );

      if (addItemError) {
        setError(addItemError);
        setSaving(false);
        return;
      }

      // Update alt texts to include the new alt text
      const { data: updatedPortfolio } =
        await PortfolioService.getPortfolioPage();
      if (updatedPortfolio) {
        const currentItemsAlt = updatedPortfolio.itemsAlt || [];
        const updatedItemsAlt = [newItemAlt, ...currentItemsAlt];

        const { error: updateAltError } =
          await PortfolioService.updatePortfolioPage({
            itemsAlt: updatedItemsAlt,
          });

        if (updateAltError) {
          setError(updateAltError);
        } else {
          setSuccess("Portfolio item added successfully");
          setNewItemImage("");
          setNewItemAlt("");
          loadPortfolioData(); // Reload to get updated data
        }
      }
    } catch (err) {
      setError("Failed to add portfolio item");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (index: number) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Get the image URL to delete from storage
      if (portfolio?.items[index]) {
        const imageUrl = portfolio.items[index].image;
        // Delete the image from storage
        await PortfolioService.deleteImage(imageUrl);
      }

      const { error } = await PortfolioService.deletePortfolioItem(index);

      if (error) {
        setError(error);
      } else {
        setSuccess("Portfolio item deleted successfully");
        loadPortfolioData(); // Reload to get updated data
        // Reset to first page if we're on the last page and it becomes empty
        if (
          currentPage > 1 &&
          currentItems.length === 1 &&
          totalPages === currentPage
        ) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (err) {
      setError("Failed to delete portfolio item");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      setError(null);

      const { data, error } = await PortfolioService.uploadImage(file);

      if (error) {
        setError(error);
      } else if (data) {
        setNewItemImage(data);
        setSuccess("Image uploaded successfully");
      }
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeywordsChange = (keywords: string[]) => {
    setSeoKeywordsArray(keywords);
  };

  // Update a single item field (country/city/pages) and persist
  const handleUpdateItemField = async (
    index: number,
    updates: Partial<Pick<PortfolioItem, "country" | "city" | "pages">>
  ) => {
    if (!portfolio) return;

    // Optimistically update local state so the UI reflects the change immediately
    const previousItems = portfolio.items;
    const nextItems = previousItems.map((it, i) =>
      i === index ? { ...it, ...updates } : it
    );
    setPortfolio({ ...portfolio, items: nextItems });

    try {
      setSaving(true);
      setError(null);
      const { error } = await PortfolioService.updatePortfolioPage({
        items: nextItems,
      });
      if (error) {
        setError(error);
        // Revert on failure
        setPortfolio({ ...portfolio, items: previousItems });
      } else {
        setSuccess("Portfolio item updated");
      }
    } catch {
      setError("Failed to update portfolio item");
      setPortfolio({ ...portfolio, items: previousItems });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit item alt text
  const handleEditItemAlt = async (index: number, newAltText: string) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Update the alt text for the specific item
      const updatedItemsAlt = [...(portfolio?.itemsAlt || [])];
      updatedItemsAlt[index] = newAltText;

      const { error } = await PortfolioService.updatePortfolioPage({
        itemsAlt: updatedItemsAlt,
      });

      if (error) {
        setError(error);
      } else {
        setSuccess("Alt text updated successfully");
        // Update the local state to reflect the change
        setPortfolio((prev) => {
          if (!prev) return prev;
          const newItemsAlt = [...(prev.itemsAlt || [])];
          newItemsAlt[index] = newAltText;
          return { ...prev, itemsAlt: newItemsAlt };
        });
      }
    } catch (err) {
      setError("Failed to update alt text");
    } finally {
      setSaving(false);
    }
  };

  // Pagination functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => goToPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (totalPages <= 1) return items;

    // Show ellipsis if there are pages between first and current range
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => goToPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if there are pages between current range and last
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => goToPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!portfolio) {
    return (
      <Alert>
        <AlertDescription>No portfolio data found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Portfolio Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio page content and images
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Title</Label>
            <Input
              id="heroTitle"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Portfolio"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroBackgroundImageAlt">
              Hero Background Image Alt Text
            </Label>
            <Input
              id="heroBackgroundImageAlt"
              value={heroBackgroundImageAlt}
              onChange={(e) => setHeroBackgroundImageAlt(e.target.value)}
              placeholder="Describe the hero background image"
            />
          </div>
        </CardContent>
      </Card>

      {/* Home Portfolio Section */}
      <Card>
        <CardHeader>
          <CardTitle>Home Portfolio Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="portfolioTitle">Title</Label>
            <Input
              id="portfolioTitle"
              value={portfolioTitle}
              onChange={(e) => setPortfolioTitle(e.target.value)}
              placeholder="Our Portfolio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioSubtitle">Subtitle</Label>
            <Textarea
              id="portfolioSubtitle"
              value={portfolioSubtitle}
              onChange={(e) => setPortfolioSubtitle(e.target.value)}
              placeholder="Explore our extensive portfolio of exhibition stands..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Items Section */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Items</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add New Item Form */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3">Add New Portfolio Item</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Image</Label>
                <Button
                  variant="outline"
                  className="w-full h-10 px-3 justify-start text-left font-normal"
                  onClick={triggerFileInput}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image Preview */}
              {newItemImage && (
                <div className="mt-2">
                  <Label>Preview</Label>
                  <div className="mt-1 border rounded-md overflow-hidden">
                    <img
                      src={newItemImage}
                      alt="New portfolio item preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Alt Text for New Item */}
              <div className="space-y-2">
                <Label htmlFor="newItemAlt">Alt Text</Label>
                <Input
                  id="newItemAlt"
                  value={newItemAlt}
                  onChange={(e) => setNewItemAlt(e.target.value)}
                  placeholder="Describe the portfolio item image"
                />
              </div>

              <Button
                onClick={handleAddItem}
                disabled={saving || !newItemImage}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Portfolio Items List - Updated to Table/List View */}
          <div className="border rounded-lg overflow-x-auto">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[96px]">Image</TableHead>
                  <TableHead className="w-[30%] min-w-[180px]">
                    Alt Text
                  </TableHead>
                  <TableHead className="w-[45%] min-w-[240px]">
                    Assignment
                  </TableHead>
                  <TableHead className="w-[72px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Image className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="mt-2">No portfolio items found</p>
                      <p className="text-sm">
                        Add your first portfolio item using the form above
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((item, index) => {
                    // Calculate the global index for the item in the entire portfolio
                    const globalIndex = (currentPage - 1) * pageSize + index;
                    const itemCountry = item.country || "";
                    const itemCity = item.city || "";
                    const itemPages = item.pages || [];
                    const citiesForCountry = itemCountry
                      ? cities.filter((c) => c.country_slug === itemCountry)
                      : [];
                    return (
                      <TableRow key={globalIndex}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={
                                portfolio.itemsAlt?.[globalIndex] ||
                                `Portfolio item ${globalIndex + 1}`
                              }
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          {editingItemIndex === globalIndex ? (
                            <div className="flex items-center gap-1 min-w-0">
                              <Input
                                value={editingItemAlt}
                                onChange={(e) =>
                                  setEditingItemAlt(e.target.value)
                                }
                                placeholder="Enter alt text"
                                className="flex-1 min-w-0"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="shrink-0"
                                onClick={() => {
                                  handleEditItemAlt(
                                    globalIndex,
                                    editingItemAlt
                                  );
                                  setEditingItemIndex(null);
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="shrink-0"
                                onClick={() => setEditingItemIndex(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="flex-1 min-w-0 truncate text-sm text-muted-foreground">
                                {portfolio.itemsAlt?.[globalIndex] ||
                                  "No alt text"}
                              </span>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setEditingItemIndex(globalIndex);
                                  setEditingItemAlt(
                                    portfolio.itemsAlt?.[globalIndex] || ""
                                  );
                                }}
                                className="shrink-0 inline-flex items-center rounded-md bg-white px-2 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <Edit className="h-4 w-4" />
                              </a>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                            <select
                              value={itemCountry}
                              disabled={saving}
                              onChange={(e) => {
                                const nextCountry = e.target.value;
                                handleUpdateItemField(globalIndex, {
                                  country: nextCountry || undefined,
                                  // Reset city if it no longer belongs to the new country
                                  city:
                                    itemCity &&
                                    cities.some(
                                      (c) =>
                                        c.city_slug === itemCity &&
                                        c.country_slug === nextCountry
                                    )
                                      ? itemCity
                                      : undefined,
                                });
                              }}
                              className="w-full min-w-0 h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="">Select country</option>
                              {countries.map((c) => (
                                <option key={c.slug} value={c.slug}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                            <select
                              value={itemCity}
                              disabled={saving || !itemCountry}
                              onChange={(e) => {
                                const nextCity = e.target.value;
                                handleUpdateItemField(globalIndex, {
                                  city: nextCity || undefined,
                                });
                              }}
                              className="w-full min-w-0 h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                            >
                              <option value="">
                                {itemCountry ? "Select city" : "Select city"}
                              </option>
                              {citiesForCountry.map((c) => (
                                <option key={c.city_slug} value={c.city_slug}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                            <MultiSelectPages
                              value={itemPages}
                              disabled={saving}
                              onChange={(next) =>
                                handleUpdateItemField(globalIndex, {
                                  pages: next.length > 0 ? next : undefined,
                                })
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteItem(globalIndex)}
                            disabled={saving}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* SEO Section */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Our Portfolio - Company Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea
              id="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Explore our portfolio of work..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoKeywords">SEO Keywords</Label>
            <TagInput
              tags={seoKeywordsArray}
              onChange={handleKeywordsChange}
              placeholder="Type keywords and press Enter"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Press Enter, comma, or semicolon after typing each keyword to add
              it
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
