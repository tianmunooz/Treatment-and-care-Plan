

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Definitions, Language, CategoryDefinition, TreatmentDefinitionItem, OptionDefinition, DynamicFieldName, Translatable, PlanTemplate, Phase, Treatment, PracticeInfo, IconName } from '../types';
import { Button } from './common/Button';
import { Input, TextArea } from './common/Input';
import { Select } from './common/Select';
import { TrashIcon, PlusIcon, SaveIcon, ChevronDownIcon, ChevronUpIcon, AlertTriangleIcon, PackageIcon, TemplateIcon, PaletteIcon, BuildingIcon, MessageCircleIcon, LanguagesIcon, CheckIcon, SearchIcon, ListFilterIcon, ImageIcon, LayoutGridIcon, ListIcon } from './icons';
import { v4 as uuidv4 } from 'uuid';
import { PhaseSection } from './PhaseSection';
import { Modal } from './common/Modal';
import { getTranslator } from '../i18n';

interface AdminPageProps {
    definitions: Definitions;
    onSave: (definitions: Definitions) => void;
    onReset: () => void;
    language: Language;
    onStartTutorial: () => void;
}

type AdminView = 'general' | 'templates' | 'treatments' | 'options' | 'danger';
type ProductViewMode = 'grid' | 'list';

const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({ title, subtitle, children, className }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-brand-background-strong mb-6 ${className}`}>
        <h2 className="text-xl font-bold text-brand-text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-brand-text-secondary mt-1 mb-4">{subtitle}</p>}
        <div className="mt-4">
            {children}
        </div>
    </div>
);

const TranslatableField: React.FC<{
    label: string;
    value: Translatable;
    onChange: (value: Translatable) => void;
    as?: 'input' | 'textarea';
    language: Language;
}> = ({ label, value, onChange, as = 'input', language }) => {
    const Component = as === 'textarea' ? TextArea : Input;
    
    const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = { ...(value || { en: '', es: '' }), [language]: e.target.value };
        onChange(newValue);
    };

    return (
        <Component
            label={`${label} (${language.toUpperCase()})`}
            value={value?.[language] || ''}
            onChange={handleLocalChange}
            rows={as === 'textarea' ? 3 : undefined}
        />
    );
};

const fieldLabels: Record<DynamicFieldName, string> = {
    targetArea: 'Target Area',
    units: 'Units',
    volume: 'Volume (ml)',
    vials: 'Vials',
    dosage: 'Dosage',
    application: 'Application Time',
    intensity: 'Intensity',
    technology: 'Technology',
};

const allDynamicFields: DynamicFieldName[] = Object.keys(fieldLabels) as DynamicFieldName[];

// --- NEW PRODUCT MANAGEMENT COMPONENTS ---

const ProductEditor: React.FC<{
    item: TreatmentDefinitionItem & { isNew?: boolean, categoryKey?: string };
    categories: { key: string, name: string }[];
    onSave: (itemToSave: TreatmentDefinitionItem, oldKey: string, categoryKey: string) => void;
    onRemove: (categoryKey: string, itemKey: string) => void;
    onCancel: () => void;
    language: Language;
    definitions: Definitions;
}> = ({ item, categories, onSave, onRemove, onCancel, language, definitions }) => {
    const [formState, setFormState] = useState(item);

    const handleFieldChange = (field: keyof TreatmentDefinitionItem['defaults'], value: any) => {
        setFormState(prev => ({ ...prev, defaults: { ...prev.defaults, [field]: value } }));
    };

    const handleTranslatableChange = (field: 'name' | 'goal', value: Translatable) => {
        if (field === 'name') {
            setFormState(prev => ({ ...prev, name: value }));
        } else {
            setFormState(prev => ({ ...prev, defaults: { ...prev.defaults, goal: value }}));
        }
    };
    
    const handleFieldsArrayChange = (fieldName: DynamicFieldName, checked: boolean) => {
        const newFields = checked
            ? [...formState.fields, fieldName]
            : formState.fields.filter(f => f !== fieldName);
        setFormState(prev => ({ ...prev, fields: newFields }));
    };

    const handleSaveClick = () => {
        if (!formState.name[language] || !formState.categoryKey) {
            alert("Product Name and Category are required.");
            return;
        }
        onSave(formState, item.key, formState.categoryKey);
    }
    
    const handleDeleteClick = () => {
        if (window.confirm("Are you sure you want to permanently delete this product?")) {
            onRemove(formState.categoryKey!, formState.key);
        }
    }

    return (
        <div className="bg-white border-t-4 border-brand-primary">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image Section */}
                <div className="md:col-span-1 space-y-4">
                    <div className="aspect-square bg-brand-background-soft rounded-lg flex items-center justify-center overflow-hidden border">
                        {formState.defaults.imageUrl ? (
                            <img src={formState.defaults.imageUrl} alt={formState.name[language]} className="w-full h-full object-cover"/>
                        ) : (
                            <ImageIcon className="w-16 h-16 text-brand-background-strong" />
                        )}
                    </div>
                    <Input label="Image URL" placeholder="https://..." value={formState.defaults.imageUrl || ''} onChange={e => handleFieldChange('imageUrl', e.target.value)} />
                </div>
                {/* Details Section */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="sm:col-span-2">
                        <TranslatableField label="Display Name" value={formState.name} onChange={val => handleTranslatableChange('name', val)} language={language} />
                    </div>
                     {item.isNew && (
                        <Select label="Category" value={formState.categoryKey} onChange={e => setFormState(p => ({...p, categoryKey: e.target.value}))}>
                            <option value="">Select a category...</option>
                            {categories.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}
                        </Select>
                     )}
                    <Input label="SKU" value={formState.defaults.sku || ''} onChange={e => handleFieldChange('sku', e.target.value)} />
                    <Input label="Brand" value={formState.defaults.brand || ''} onChange={e => handleFieldChange('brand', e.target.value)} />
                    <Input label="Cost ($)" type="number" placeholder="0.00" value={formState.defaults.cost || ''} onChange={e => handleFieldChange('cost', parseFloat(e.target.value) || 0)} />
                    <Input label="Price ($)" type="number" placeholder="0.00" value={formState.defaults.price || ''} onChange={e => handleFieldChange('price', parseFloat(e.target.value) || 0)} />
                     <div className="sm:col-span-2">
                         <TranslatableField label="Default Goal" as="textarea" value={formState.defaults.goal} onChange={val => handleTranslatableChange('goal', val)} language={language} />
                    </div>
                </div>
            </div>
            {/* Advanced Edit Section */}
             <div className="p-6 border-t">
                 <h4 className="font-semibold text-brand-text-primary mb-3">Field Configuration</h4>
                 <div className="p-3 border rounded-md bg-brand-background-soft">
                     <p className="text-xs text-brand-text-secondary mb-2">Select fields to show when adding this item to a plan.</p>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2">
                         {allDynamicFields.map(field => (
                             <label key={field} className="flex items-center p-1.5 rounded-md hover:bg-white transition-colors cursor-pointer">
                                 <input
                                     type="checkbox"
                                     checked={formState.fields.includes(field)}
                                     onChange={e => handleFieldsArrayChange(field, e.target.checked)}
                                     className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                 />
                                <span className="text-sm font-medium text-brand-text-primary ml-2">{fieldLabels[field]}</span>
                             </label>
                         ))}
                     </div>
                 </div>
            </div>

            <div className="bg-brand-background-soft p-4 flex justify-between items-center">
                 <Button variant="danger" onClick={handleDeleteClick} disabled={item.isNew}>Delete</Button>
                 <div className="flex gap-2">
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveClick}>Save Changes</Button>
                 </div>
            </div>
        </div>
    );
};

const ProductServicesManager: React.FC<{
    localDefs: Definitions,
    setLocalDefs: React.Dispatch<React.SetStateAction<Definitions>>,
    language: Language,
    definitions: Definitions,
}> = ({ localDefs, setLocalDefs, language, definitions }) => {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [brandFilter, setBrandFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<TreatmentDefinitionItem & { isNew: boolean } | null>(null);
    const [viewMode, setViewMode] = useState<ProductViewMode>('grid');

    const allProducts = useMemo(() => {
        return Object.entries(localDefs.categories).flatMap(([categoryKey, category]) =>
            category.items.map(item => ({
                ...item,
                id: `${categoryKey}/${item.key}`,
                categoryKey,
                categoryName: category.displayName[language],
            }))
        );
    }, [localDefs.categories, language]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            const matchesCategory = categoryFilter === 'all' || p.categoryKey === categoryFilter;
            const matchesBrand = brandFilter === 'all' || p.defaults.brand === brandFilter;
            const searchTermLower = searchTerm.toLowerCase();
            const matchesSearch = searchTerm === '' || 
                p.name[language].toLowerCase().includes(searchTermLower) || 
                (p.defaults.sku && p.defaults.sku.toLowerCase().includes(searchTermLower)) ||
                (p.defaults.brand && p.defaults.brand.toLowerCase().includes(searchTermLower));
            return matchesCategory && matchesBrand && matchesSearch;
        });
    }, [allProducts, categoryFilter, brandFilter, searchTerm, language]);
    
    const categoryOptions = useMemo(() => Object.entries(localDefs.categories).map(([key, cat]) => ({ key, name: cat.displayName[language] })), [localDefs.categories, language]);
    
    const brandOptions = useMemo(() => {
        const brands = new Set<string>();
        allProducts.forEach(p => {
            if (p.defaults.brand) {
                brands.add(p.defaults.brand);
            }
        });
        return Array.from(brands).sort();
    }, [allProducts]);

    const handleAddNewItem = () => {
        const newKey = `new-item-${uuidv4()}`;
        const templateItem: TreatmentDefinitionItem & {isNew: boolean, categoryKey?: string} = {
            key: newKey,
            name: { en: 'New Product', es: 'Nuevo Producto' },
            fields: [],
            defaults: {
                goal: { en: '', es: '' },
                icon: 'Package' as IconName,
                price: 0,
            },
            isNew: true,
            categoryKey: categoryOptions.length > 0 ? categoryOptions[0].key : undefined,
        };
        setNewItem(templateItem);
        setExpandedItemId(null); // Close other expanded items
    }
    
    const handleItemSave = (itemToSave: TreatmentDefinitionItem, oldKey: string, categoryKey: string) => {
        setLocalDefs(prev => {
            const newDefs = JSON.parse(JSON.stringify(prev));
            const { isNew, id, categoryName, ...cleanItem } = itemToSave as any;

            // Remove from old location if it existed
            Object.values(newDefs.categories as Record<string, CategoryDefinition>).forEach(cat => {
                cat.items = cat.items.filter(i => i.key !== oldKey);
            });
            
            // Add to new location
            if (newDefs.categories[categoryKey]) {
                const itemIndex = newDefs.categories[categoryKey].items.findIndex((i: TreatmentDefinitionItem) => i.key === cleanItem.key);
                if (itemIndex > -1) {
                    newDefs.categories[categoryKey].items[itemIndex] = cleanItem;
                } else {
                    newDefs.categories[categoryKey].items.push(cleanItem);
                }
            }
            return newDefs;
        });
        setExpandedItemId(null);
        setNewItem(null);
    };
    
    const handleRemoveItem = (categoryKey: string, itemKey: string) => {
        if (!window.confirm("Are you sure you want to permanently delete this product? This action cannot be undone.")) {
            return;
        }
        setLocalDefs(prev => {
            const newDefs = JSON.parse(JSON.stringify(prev));
            if (newDefs.categories[categoryKey]) {
                newDefs.categories[categoryKey].items = newDefs.categories[categoryKey].items.filter((i: TreatmentDefinitionItem) => i.key !== itemKey);
            }
            return newDefs;
        });
        setExpandedItemId(null);
        setNewItem(null);
    }
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow">
                {/* Toolbar */}
                <div className="bg-white p-3 rounded-lg shadow-sm border border-brand-background-strong flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            wrapperClassName="min-w-[180px]"
                        >
                            <option value="all">Category: All</option>
                            {categoryOptions.map(cat => (
                                <option key={cat.key} value={cat.key}>
                                    {cat.name}
                                </option>
                            ))}
                        </Select>
                        <Select
                            value={brandFilter}
                            onChange={e => setBrandFilter(e.target.value)}
                            wrapperClassName="min-w-[180px]"
                        >
                            <option value="all">Brand: All</option>
                            {brandOptions.map(brand => (
                                <option key={brand} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </Select>
                        <Input
                            placeholder="Quick Search"
                            Icon={SearchIcon}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            wrapperClassName="min-w-[180px]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center bg-brand-background-medium p-0.5 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-primary' : 'text-brand-text-secondary hover:bg-white/50'}`}
                                aria-label="Grid View"
                            >
                                <LayoutGridIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-brand-text-secondary hover:bg-white/50'}`}
                                aria-label="List View"
                            >
                                <ListIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <Button variant="primary" onClick={handleAddNewItem} Icon={PlusIcon} className="!rounded-lg">
                            Add Product
                        </Button>
                    </div>
                </div>

                {/* New Item Editor */}
                {newItem && (
                    <div className="mt-4 rounded-lg shadow-md overflow-hidden border border-brand-primary">
                        <ProductEditor
                            item={newItem}
                            categories={categoryOptions}
                            onSave={handleItemSave}
                            onRemove={handleRemoveItem}
                            onCancel={() => setNewItem(null)}
                            language={language}
                            definitions={definitions}
                        />
                    </div>
                )}

                {/* Product Grid / List */}
                {viewMode === 'grid' && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-brand-background-strong overflow-hidden">
                                <div
                                    className="p-4 cursor-pointer hover:bg-brand-background-soft transition-colors"
                                    onClick={() => { setExpandedItemId(expandedItemId === product.id ? null : product.id); setNewItem(null); }}
                                >
                                    <div className="w-full h-40 bg-brand-background-soft rounded-lg flex items-center justify-center border overflow-hidden mb-4">
                                        {product.defaults.imageUrl ? (
                                            <img src={product.defaults.imageUrl} alt={product.name[language]} className="w-full h-full object-cover"/>
                                        ) : (
                                            <PackageIcon className="w-16 h-16 text-brand-background-strong" />
                                        )}
                                    </div>
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-brand-text-primary truncate">{product.name[language]}</h4>
                                            <p className="text-sm text-brand-text-secondary truncate">{product.defaults.brand || 'No Brand'}</p>
                                        </div>
                                        <p className="font-semibold text-brand-text-primary whitespace-nowrap">{formatCurrency(product.defaults.price || 0)}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-brand-text-body">{product.categoryName}</p>
                                        <ChevronDownIcon className={`w-5 h-5 text-brand-text-secondary transition-transform ${expandedItemId === product.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                                {expandedItemId === product.id && (
                                     <ProductEditor
                                        item={{...product, isNew: false}}
                                        categories={categoryOptions}
                                        onSave={handleItemSave}
                                        onRemove={handleRemoveItem}
                                        onCancel={() => setExpandedItemId(null)}
                                        language={language}
                                        definitions={definitions}
                                     />
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {viewMode === 'list' && (
                     <div className="mt-4 space-y-2">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-brand-background-strong overflow-hidden">
                                <div
                                    className="p-4 cursor-pointer hover:bg-brand-background-soft transition-colors flex justify-between items-center"
                                    onClick={() => { setExpandedItemId(expandedItemId === product.id ? null : product.id); setNewItem(null); }}
                                >
                                    <div className="flex items-center gap-4 flex-grow min-w-0">
                                        <div className="w-12 h-12 bg-brand-background-soft rounded-lg flex items-center justify-center border overflow-hidden flex-shrink-0">
                                            {product.defaults.imageUrl ? (
                                                <img src={product.defaults.imageUrl} alt={product.name[language]} className="w-full h-full object-cover"/>
                                            ) : (
                                                <PackageIcon className="w-8 h-8 text-brand-background-strong" />
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-semibold text-brand-text-primary truncate">{product.name[language]}</h4>
                                            <p className="text-sm text-brand-text-secondary truncate">{product.defaults.sku || 'No SKU'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 flex-shrink-0 ml-4">
                                        <p className="text-sm text-brand-text-body hidden md:block w-32 truncate text-right">{product.categoryName}</p>
                                        <p className="font-semibold text-brand-text-primary whitespace-nowrap w-20 text-right">{formatCurrency(product.defaults.price || 0)}</p>
                                        <ChevronDownIcon className={`w-5 h-5 text-brand-text-secondary transition-transform ${expandedItemId === product.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                                {expandedItemId === product.id && (
                                     <ProductEditor
                                        item={{...product, isNew: false}}
                                        categories={categoryOptions}
                                        onSave={handleItemSave}
                                        onRemove={handleRemoveItem}
                                        onCancel={() => setExpandedItemId(null)}
                                        language={language}
                                        definitions={definitions}
                                     />
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
                {filteredProducts.length === 0 && !newItem && (
                    <div className="col-span-full text-center p-12 text-brand-text-secondary">
                        <PackageIcon className="w-12 h-12 mx-auto text-brand-background-strong" />
                        <h4 className="mt-4 text-lg font-semibold">No products found</h4>
                        <p>Try adjusting your filters or add a new product.</p>
                    </div>
                )}
            </div>
            {/* Sidebar */}
            <div className="lg:w-72 flex-shrink-0">
                <div className="bg-white p-5 rounded-lg shadow-sm border sticky top-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-text-secondary">Overview</h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <p className="text-2xl font-bold text-brand-text-primary">{allProducts.length}</p>
                            <p className="text-sm text-brand-text-secondary">Total Products</p>
                        </div>
                         <div>
                            <p className="text-2xl font-bold text-brand-text-primary">{categoryOptions.length}</p>
                            <p className="text-sm text-brand-text-secondary">Total Categories</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


// --- OLDER COMPONENTS (FOR OTHER TABS) ---
const GeneralSettingsEditor: React.FC<{
    localDefs: Definitions;
    setLocalDefs: React.Dispatch<React.SetStateAction<Definitions>>;
}> = ({ localDefs, setLocalDefs }) => {
    
    const handleChange = (field: keyof PracticeInfo, value: string) => {
        setLocalDefs(prev => ({
            ...prev,
            practiceInfo: {
                ...prev.practiceInfo,
                [field]: value
            }
        }));
    };

    return (
        <Section title="General Settings" subtitle="This information will appear on all generated plan documents.">
            <div className="space-y-4">
                <Input 
                    label="Practice Name" 
                    value={localDefs.practiceInfo.name} 
                    onChange={e => handleChange('name', e.target.value)}
                />
                <Input 
                    label="Logo Image URL" 
                    placeholder="https://your-site.com/logo.png"
                    value={localDefs.practiceInfo.logoUrl} 
                    onChange={e => handleChange('logoUrl', e.target.value)}
                />
                 <Input 
                    label="Provider Name" 
                    value={localDefs.practiceInfo.provider} 
                    onChange={e => handleChange('provider', e.target.value)}
                />
                <TextArea 
                    label="Address" 
                    value={localDefs.practiceInfo.address} 
                    onChange={e => handleChange('address', e.target.value)}
                    rows={2}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                        label="Phone Number" 
                        value={localDefs.practiceInfo.phone} 
                        onChange={e => handleChange('phone', e.target.value)}
                    />
                    <Input 
                        label="Email" 
                        type="email"
                        value={localDefs.practiceInfo.email} 
                        onChange={e => handleChange('email', e.target.value)}
                    />
                 </div>
                 <Input 
                    label="Website" 
                    placeholder="www.your-website.com"
                    value={localDefs.practiceInfo.website} 
                    onChange={e => handleChange('website', e.target.value)}
                />
            </div>
        </Section>
    );
};

const TemplateEditor: React.FC<{
    template: PlanTemplate;
    onTemplateChange: (template: PlanTemplate) => void;
    onRemoveTemplate: (templateId: string) => void;
    language: Language;
    definitions: Definitions;
}> = ({ template, onTemplateChange, onRemoveTemplate, language, definitions }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Handlers for modifying the template, which then call onTemplateChange
    const updatePhase = (updatedPhase: Phase) => {
        const newPhases = template.phases.map(p => p.id === updatedPhase.id ? updatedPhase : p);
        onTemplateChange({ ...template, phases: newPhases });
    };

    const removePhase = (phaseId: string) => {
        const newPhases = template.phases.filter(p => p.id !== phaseId);
        onTemplateChange({ ...template, phases: newPhases });
    };

    const addPhase = () => {
        const newPhase: Phase = {
            id: uuidv4(),
            title: `New Phase ${template.phases.length + 1}`,
            treatments: [],
            controlsAndMetrics: [],
        };
        onTemplateChange({ ...template, phases: [...template.phases, newPhase] });
    };

    const addTreatmentToPhase = (phaseId: string) => {
      const newTreatment: Treatment = {
        id: uuidv4(), categoryKey: '', treatmentKey: '', goal: '', frequency: '', price: 0, icon: 'Syringe', week: '', keyInstructions: '',
      };
      const newPhases = template.phases.map(p => p.id === phaseId ? { ...p, treatments: [...p.treatments, newTreatment] } : p);
      onTemplateChange({ ...template, phases: newPhases });
    };
    
    const saveTreatment = (treatment: Treatment, phaseId: string) => {
        const newPhases = template.phases.map(p => {
            if (p.id === phaseId) {
                const treatments = [...p.treatments];
                const index = treatments.findIndex(t => t.id === treatment.id);
                if (index > -1) {
                    treatments[index] = treatment;
                } else {
                    treatments.push(treatment);
                }
                return { ...p, treatments };
            }
            return p;
        });
        onTemplateChange({ ...template, phases: newPhases });
    };
    
    const removeTreatment = (treatmentId: string, phaseId: string) => {
      const newPhases = template.phases.map(p => {
        if (p.id === phaseId) {
          const newTreatments = p.treatments.filter(t => t.id !== treatmentId);
          return { ...p, treatments: newTreatments };
        }
        return p;
      });
      onTemplateChange({ ...template, phases: newPhases });
    };
    
    const moveTreatment = (treatmentId: string, sourcePhaseId: string, targetPhaseId: string, targetTreatmentId: string | null) => {
        let movedTreatment: Treatment | undefined;
        let newPhases = [...template.phases];

        // Remove from source
        const sourcePhase = newPhases.find(p => p.id === sourcePhaseId);
        if(sourcePhase) {
            movedTreatment = sourcePhase.treatments.find(t => t.id === treatmentId);
            sourcePhase.treatments = sourcePhase.treatments.filter(t => t.id !== treatmentId);
        }

        if (!movedTreatment) return;

        // Add to target
        const targetPhase = newPhases.find(p => p.id === targetPhaseId);
        if(targetPhase) {
            if (targetTreatmentId) {
                const targetIndex = targetPhase.treatments.findIndex(t => t.id === targetTreatmentId);
                targetPhase.treatments.splice(targetIndex, 0, movedTreatment);
            } else {
                targetPhase.treatments.push(movedTreatment);
            }
        }
        onTemplateChange({ ...template, phases: newPhases });
    };

    return (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-brand-text-primary flex-grow cursor-pointer" onClick={() => setIsOpen(!isOpen)}>{template.title[language]}</h3>
                <div className="flex items-center">
                    <Button variant="ghost" className="!p-2 text-brand-text-secondary hover:text-brand-error hover:bg-red-50" onClick={() => onRemoveTemplate(template.id)}>
                        <TrashIcon className="w-5 h-5"/>
                    </Button>
                    <div onClick={() => setIsOpen(!isOpen)} className="ml-2 cursor-pointer">
                        {isOpen ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
                    </div>
                </div>
            </div>
            {isOpen && (
                 <div className="mt-4 pt-4 border-t space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TranslatableField 
                            label="Template Title" 
                            value={template.title} 
                            onChange={val => onTemplateChange({...template, title: val})}
                            language={language}
                        />
                        <Select
                            label="Template Category"
                            value={template.categoryKey || ''}
                            onChange={(e) => onTemplateChange({ ...template, categoryKey: e.target.value })}
                        >
                            <option value="">Uncategorized</option>
                            {definitions.options.templateCategories.map(cat => (
                                <option key={cat.key} value={cat.key}>
                                    {cat.name[language]}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <TranslatableField 
                        label="Template Notes" 
                        value={template.notes} 
                        onChange={val => onTemplateChange({...template, notes: val})}
                        as="textarea"
                        language={language}
                    />
                    <h4 className="font-semibold mt-6 mb-2 text-brand-text-secondary">Template Phases:</h4>
                    <div className="space-y-4 p-4 bg-brand-background-soft rounded-lg">
                        {template.phases.map((phase) => (
                            <PhaseSection
                                key={phase.id}
                                phase={phase}
                                updatePhase={updatePhase}
                                removePhase={() => removePhase(phase.id)}
                                onAddTreatment={addTreatmentToPhase}
                                onSaveTreatment={saveTreatment}
                                onRemoveTreatment={removeTreatment}
                                onMoveTreatment={moveTreatment}
                                definitions={definitions}
                                language={language}
                                animatedTreatmentId={null}
                                clearAnimation={() => {}}
                                setActivePhaseId={() => {}}
                            />
                        ))}
                        <Button variant="secondary" Icon={PlusIcon} onClick={addPhase}>Add Phase</Button>
                    </div>
                 </div>
            )}
        </div>
    );
}

const OptionGroupEditor: React.FC<{
    title: string;
    options: OptionDefinition[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, updatedOption: OptionDefinition) => void;
    language: Language;
  }> = ({ title, options, onAdd, onRemove, onChange, language }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="mb-2 border border-brand-background-strong rounded-lg bg-white overflow-hidden shadow-sm">
          <div
              className="w-full flex justify-between items-center p-4 text-left cursor-pointer hover:bg-brand-background-soft transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary"
              onClick={() => setIsOpen(!isOpen)}
              role="button"
              aria-expanded={isOpen}
          >
              <h4 className="font-semibold text-brand-text-primary">{title}</h4>
              {isOpen ? <ChevronUpIcon className="w-5 h-5 text-brand-primary" /> : <ChevronDownIcon className="w-5 h-5 text-brand-text-secondary" />}
          </div>
          {isOpen && (
              <div className="p-4 border-t border-brand-background-strong space-y-3 bg-brand-background-soft">
                  {options.map((option, index) => (
                      <div key={option.key} className="flex items-end gap-2 p-3 rounded-md bg-white border border-brand-background-medium">
                          <Input
                            label={`Option Name (${language.toUpperCase()})`}
                            value={option.name[language] || ''}
                            wrapperClassName='flex-grow'
                            onChange={e => onChange(index, { ...option, name: { ...option.name, [language]: e.target.value }})}
                          />
                          <Button variant="ghost" className="!p-2 text-brand-error mb-1 hover:bg-red-50" onClick={() => onRemove(index)}>
                              <TrashIcon className="w-5 h-5" />
                          </Button>
                      </div>
                  ))}
                   <div className="pt-2">
                      <Button variant="secondary" Icon={PlusIcon} onClick={onAdd}>
                          Add Option
                      </Button>
                  </div>
              </div>
          )}
      </div>
    )
};


export const AdminPage: React.FC<AdminPageProps> = ({ definitions, onSave, onReset, language, onStartTutorial }) => {
    const [localDefs, setLocalDefs] = useState<Definitions>(() => JSON.parse(JSON.stringify(definitions)));
    const [editLanguage, setEditLanguage] = useState<Language>(language);
    const [activeView, setActiveView] = useState<AdminView>('treatments');
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);

    const t = getTranslator(language);

    // Modal States
    const [modalState, setModalState] = useState<{ type: 'option' | null; targetKey?: string }>({ type: null });
    const [newItemData, setNewItemData] = useState<any>({});
    
    useEffect(() => {
        setLocalDefs(JSON.parse(JSON.stringify(definitions)));
    }, [definitions]);

    useEffect(() => {
      setEditLanguage(language);
    }, [language]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
            setLangDropdownOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

    const handleSave = () => {
        onSave(localDefs);
    };
    
     const handleLangSelect = (lang: Language) => {
        setEditLanguage(lang);
        setLangDropdownOpen(false);
    };

    // --- Modal Opening Functions ---
    const openAddOptionModal = (optionType: keyof Definitions['options']) => {
        setNewItemData({ key: `new-option-${Date.now()}`, name: { en: 'New Option', es: 'Nueva Opción' } });
        setModalState({ type: 'option', targetKey: optionType });
    };
    
    const closeModal = () => {
        setModalState({ type: null });
        setNewItemData({});
    };

    // --- Data Manipulation Functions ---
    const handleAddOption = () => {
        const optionType = modalState.targetKey as keyof Definitions['options'];
        if (!newItemData.name?.en || !optionType) return alert("Please enter a name.");
        setLocalDefs(prev => ({ ...prev, options: { ...prev.options, [optionType]: [...prev.options[optionType], newItemData] } }));
        closeModal();
    };

    const handleRemoveTemplate = (templateId: string) => {
        if (!window.confirm("Delete this template?")) return;
        setLocalDefs(prev => ({...prev, planTemplates: prev.planTemplates.filter(t => t.id !== templateId)}));
    };

    const handleRemoveOption = (optionType: keyof Definitions['options'], index: number) => {
        if(!window.confirm("Delete this option?")) return;
        setLocalDefs(prev => ({...prev, options: {...prev.options, [optionType]: prev.options[optionType].filter((_, i) => i !== index)}}));
    };
    
    const handleOptionChange = (optionType: keyof Definitions['options'], index: number, updatedOption: OptionDefinition) => {
        setLocalDefs(prev => {
            const newOptions = [...prev.options[optionType]]; newOptions[index] = updatedOption;
            return {...prev, options: { ...prev.options, [optionType]: newOptions }};
        });
    };

    const handleTemplateChange = (updatedTemplate: PlanTemplate) => {
      setLocalDefs(prev => ({...prev, planTemplates: prev.planTemplates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t)}));
    };
    
    // Handler to add a new template, opens a modal or inline form
    const handleAddTemplate = () => {
        const baseTemplate = definitions.planTemplates.find(t => t.id === 'blank-plan') || definitions.planTemplates[0];
        const newTemplate = {
            ...JSON.parse(JSON.stringify(baseTemplate)),
            id: uuidv4(),
            title: { en: "New Custom Template", es: "Nueva Plantilla Personalizada" },
            notes: { en: "A new template created by the user.", es: "Una nueva plantilla creada por el usuario." },
            phases: [{ id: uuidv4(), title: 'Phase 1', treatments: [], controlsAndMetrics: [] }],
        };
        setLocalDefs(prev => ({...prev, planTemplates: [...prev.planTemplates, newTemplate]}));
    };

    const navItems = [
        { id: 'general', label: 'General', icon: BuildingIcon },
        { id: 'templates', label: 'Templates', icon: TemplateIcon },
        { id: 'treatments', label: 'Products & Services', icon: PackageIcon },
        { id: 'options', label: 'Options', icon: PaletteIcon },
        { id: 'danger', label: 'Danger Zone', icon: AlertTriangleIcon },
    ];
    
    const TabButton: React.FC<{view: AdminView, label: string, icon: React.ElementType}> = ({ view, label, icon: Icon }) => {
        const isActive = activeView === view;
        return (
            <button id={`admin-nav-${view}`} onClick={() => setActiveView(view)} className={`px-3 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${isActive ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-text-secondary hover:text-brand-primary'}`}>
                <Icon className="w-5 h-5" />
                <span>{label}</span>
            </button>
        )
    };

    const optionTypeLabels: Record<keyof Definitions['options'], string> = {
        technologies: 'Technologies', timelines: 'Timelines (Weeks/Months)', frequencies: 'Frequencies',
        targetAreas: 'Target Areas', intensities: 'Intensities', applications: 'Application Times (AM/PM)',
        templateCategories: 'Template Categories', phaseTitles: 'Phase Titles',
    };

    return (
        <div className="flex flex-col h-full bg-brand-background-soft">
            <div className="p-4 md:px-6 border-b bg-white">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <h1 className="text-2xl font-bold text-brand-text-primary">{t('admin')}</h1>
                    <div className="flex items-center gap-2 sm:gap-4">
                       <div ref={langDropdownRef} className="relative">
                            <Button 
                                variant="secondary" 
                                className="!p-2" 
                                id="admin-lang-switcher"
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                aria-label="Change language for editing"
                            >
                                <LanguagesIcon className="w-5 h-5" />
                            </Button>
                            {langDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-brand-background-strong py-1 z-20">
                                    <button 
                                        onClick={() => handleLangSelect('en')} 
                                        className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-brand-text-primary hover:bg-brand-background-soft"
                                    >
                                        {t('langEnglish')}
                                        {editLanguage === 'en' && <CheckIcon className="w-4 h-4 text-brand-primary" />}
                                    </button>
                                    <button 
                                        onClick={() => handleLangSelect('es')} 
                                        className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-brand-text-primary hover:bg-brand-background-soft"
                                    >
                                        {t('langSpanish')}
                                        {editLanguage === 'es' && <CheckIcon className="w-4 h-4 text-brand-primary" />}
                                    </button>
                                </div>
                            )}
                        </div>
                        <Button id="admin-save-button" onClick={handleSave} Icon={SaveIcon}>
                            <span className="hidden sm:inline">Save Changes</span>
                        </Button>
                    </div>
                </div>
                 <div className="mt-4 border-b -mb-[1px] -mx-4 md:-mx-6 px-4 md:px-6">
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                        {navItems.map(item => <TabButton key={item.id} view={item.id as AdminView} label={item.label} icon={item.icon} /> )}
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                <div className="p-4 md:p-6">
                    {activeView === 'general' && <GeneralSettingsEditor localDefs={localDefs} setLocalDefs={setLocalDefs} />}
                    
                    {activeView === 'treatments' && <ProductServicesManager localDefs={localDefs} setLocalDefs={setLocalDefs} language={editLanguage} definitions={definitions} />}

                    {activeView === 'templates' && (
                        <Section title="Plan Templates" subtitle="Define the starting points for treatment plans.">
                            {localDefs.planTemplates.filter(t => t.id !== 'blank-plan').map(template => (
                                <TemplateEditor key={template.id} template={template} onTemplateChange={handleTemplateChange} onRemoveTemplate={handleRemoveTemplate} language={editLanguage} definitions={localDefs} />
                            ))}
                            <div className="mt-6"><Button variant="secondary" Icon={PlusIcon} onClick={handleAddTemplate}>Add New Template</Button></div>
                        </Section>
                    )}

                    {activeView === 'options' && (
                         <Section title="Dropdown Options" subtitle="Manage the values available in various dropdown menus across the app.">
                            {Object.entries(optionTypeLabels).map(([key, title]) => (
                                <OptionGroupEditor
                                    key={key} title={title}
                                    options={localDefs.options[key as keyof Definitions['options']]}
                                    onAdd={() => openAddOptionModal(key as keyof Definitions['options'])}
                                    onRemove={(index) => handleRemoveOption(key as keyof Definitions['options'], index)}
                                    onChange={(index, value) => handleOptionChange(key as keyof Definitions['options'], index, value)}
                                    language={editLanguage}
                                />
                            ))}
                        </Section>
                    )}

                    {activeView === 'danger' && (
                        <Section title="Danger Zone" className="border-red-500 bg-red-50">
                            <div className="p-4 rounded-lg bg-red-100/50 border border-red-200"><div className="flex">
                                <div className="flex-shrink-0"><AlertTriangleIcon className="h-5 w-5 text-red-400" /></div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Reset All Definitions</h3>
                                    <div className="mt-2 text-sm text-red-700"><p>This action will permanently delete all your custom products, services, templates, and settings, and restore the application to its original default state. This cannot be undone.</p></div>
                                    <div className="mt-4"><Button variant="danger" onClick={onReset}>Reset to Default</Button></div>
                                </div>
                            </div></div>
                        </Section>
                    )}
                </div>
            </div>
            
            <Modal isOpen={modalState.type === 'option'} onClose={closeModal} title={`Add Option to ${optionTypeLabels[modalState.targetKey as keyof Definitions['options']] || ''}`} footer={<><Button variant="secondary" onClick={closeModal}>Cancel</Button><Button variant="primary" onClick={handleAddOption}>Save Option</Button></>}>
                <TranslatableField label="Option Name" value={newItemData.name} onChange={val => setNewItemData(p => ({...p, name: val}))} language={editLanguage} />
            </Modal>
        </div>
    );
};