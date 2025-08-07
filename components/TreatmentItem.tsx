
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Treatment, Phase, DynamicFieldName, Definitions } from '../types';
import { Input, TextArea } from './common/Input';
import { Select } from './common/Select';
import { Button } from './common/Button';
import { TrashIcon, DragHandleIcon, CalendarIcon, EditIcon, CheckIcon, CancelIcon, SyringeIcon, SparkleIcon } from './icons';
import { TREATMENT_ICONS } from '../constants';
import { geminiService } from '../services/geminiService';
import { MultiSelectDropdown } from './common/MultiSelectDropdown';
import { Language } from '../i18n';
import { Search } from 'lucide-react';

interface TreatmentItemProps {
  treatment: Treatment;
  phaseId: string;
  onSave: (treatment: Treatment, phaseId:string) => void;
  onRemove: (treatmentId: string, phaseId: string) => void;
  animatedTreatmentId: string | null;
  clearAnimation: () => void;
  definitions: Definitions;
  language: Language;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getQuantityInfo = (treatmentState: Treatment, defs: Definitions): { isQuantityBased: boolean; quantityField: 'units' | 'volume' | 'vials' | null; quantityLabel: string } => {
    const categoryDef = defs.categories[treatmentState.categoryKey];
    if (!categoryDef) return { isQuantityBased: false, quantityField: null, quantityLabel: '' };
    const currentTreatmentDef = categoryDef.items.find(item => item.key === treatmentState.treatmentKey);
    if (!currentTreatmentDef) return { isQuantityBased: false, quantityField: null, quantityLabel: '' };

    if (currentTreatmentDef.fields.includes('units')) return { isQuantityBased: true, quantityField: 'units', quantityLabel: 'Unit' };
    if (currentTreatmentDef.fields.includes('volume')) return { isQuantityBased: true, quantityField: 'volume', quantityLabel: 'ml' };
    if (currentTreatmentDef.fields.includes('vials')) return { isQuantityBased: true, quantityField: 'vials', quantityLabel: 'Vial' };
    
    return { isQuantityBased: false, quantityField: null, quantityLabel: '' };
};

export const TreatmentItem: React.FC<TreatmentItemProps> = ({ treatment, phaseId, onSave, onRemove, animatedTreatmentId, clearAnimation, definitions, language }) => {
  const [isEditing, setIsEditing] = useState(() => !treatment.treatmentKey && !treatment.categoryKey);
  const [formState, setFormState] = useState<Treatment>({...treatment, pricePerUnit: treatment.pricePerUnit || 0});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  
  const isAnimated = treatment.id === animatedTreatmentId;
  
  const treatmentDef = definitions.categories[treatment.categoryKey]?.items.find(i => i.key === treatment.treatmentKey);
  const treatmentDisplayName = treatmentDef ? treatmentDef.name[language] : 'Untitled Treatment';

  const { isQuantityBased, quantityField, quantityLabel } = getQuantityInfo(formState, definitions);

  const allTreatments = useMemo(() => {
    return Object.entries(definitions.categories).flatMap(([categoryKey, category]) =>
      category.items.map(item => ({
        ...item,
        categoryKey,
        categoryName: category.displayName[language],
      }))
    );
  }, [definitions, language]);

  const filteredTreatments = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowercasedTerm = searchTerm.toLowerCase();
    return allTreatments.filter(t =>
      t.name[language].toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm, allTreatments, language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (
            searchResultsRef.current && 
            !searchResultsRef.current.contains(event.target as Node) &&
            searchInputRef.current &&
            !searchInputRef.current.contains(event.target as Node)
        ) {
            setSearchTerm('');
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAnimated) {
      const timer = setTimeout(() => {
        clearAnimation();
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [isAnimated, clearAnimation]);
  
  useEffect(() => {
    if (isQuantityBased && quantityField) {
      const quantity = parseFloat(formState[quantityField] as string || '0');
      const pricePer = formState.pricePerUnit || 0;
      const totalPrice = quantity * pricePer;
      if (formState.price !== totalPrice) {
        setFormState(prev => ({ ...prev, price: totalPrice }));
      }
    }
  }, [formState.units, formState.volume, formState.vials, formState.pricePerUnit, isQuantityBased, quantityField, formState.price]);


  useEffect(() => {
    if (!isEditing) {
      setFormState(treatment);
    }
  }, [treatment, isEditing]);

  const handleMultiSelectChange = (name: keyof Treatment, selected: string[]) => {
     setFormState(prev => ({ ...prev, [name]: selected }));
  }

  const handleSave = () => {
    if (formState.treatmentKey && formState.categoryKey) {
        onSave(formState, phaseId);
        setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    if (!treatment.treatmentKey && !treatment.categoryKey) {
      onRemove(treatment.id, phaseId);
    } else {
      setFormState(treatment);
      setIsEditing(false);
    }
  };
  
  const handleGenerateInstructions = async () => {
      const currentTreatmentDef = definitions.categories[formState.categoryKey]?.items.find(i => i.key === formState.treatmentKey);
      if (!currentTreatmentDef || !formState.goal) return;
      setIsGenerating(true);
      try {
          const instructions = await geminiService.generateInstructions(currentTreatmentDef.name[language], formState.goal);
          setFormState(prev => ({ ...prev, keyInstructions: instructions }));
      } catch (e) {
          console.error(e);
      } finally {
          setIsGenerating(false);
      }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue: string | number = value;
    if (name === 'price' || name === 'discount' || name === 'pricePerUnit') {
      processedValue = parseFloat(value) || 0;
    }

    const newFormState: Treatment = {
        ...formState,
        [name]: processedValue
    };
    setFormState(newFormState);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryKey = e.target.value;
    // When category changes, reset the treatment and its specific fields
    setFormState(prev => ({
        id: prev.id, // Keep the id
        categoryKey: newCategoryKey,
        treatmentKey: '',
        goal: '',
        frequency: '',
        price: 0,
        icon: 'Syringe',
        week: '',
        keyInstructions: '',
        discount: 0,
        targetArea: [],
    }));
  };
  
  const handleTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTreatmentKey = e.target.value;
      const treatmentDef = definitions.categories[formState.categoryKey]?.items.find(i => i.key === newTreatmentKey);
      if (!treatmentDef) return;

      // Deep copy defaults to avoid mutation, and build new state
      const newFormState = {
        ...JSON.parse(JSON.stringify(treatmentDef.defaults)),
        id: formState.id, // Preserve the original ID
        categoryKey: formState.categoryKey,
        treatmentKey: newTreatmentKey,
        goal: treatmentDef.defaults.goal[language] || '',
        contraindications: treatmentDef.defaults.contraindications ? treatmentDef.defaults.contraindications[language] : undefined,
      };
      
      setFormState(newFormState);
  };

  const handleSearchSelect = (categoryKey: string, treatmentKey: string) => {
    const treatmentDef = definitions.categories[categoryKey]?.items.find(i => i.key === treatmentKey);
    if (!treatmentDef) return;

    const newFormState = {
      ...JSON.parse(JSON.stringify(treatmentDef.defaults)),
      id: formState.id,
      categoryKey: categoryKey,
      treatmentKey: treatmentKey,
      goal: treatmentDef.defaults.goal[language] || '',
      contraindications: treatmentDef.defaults.contraindications ? treatmentDef.defaults.contraindications[language] : undefined,
    };
    
    setFormState(newFormState);
    setSearchTerm('');
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('treatmentId', treatment.id);
    e.dataTransfer.setData('phaseId', phaseId);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
      setIsDragging(false);
  };

  const finalPrice = (formState.price || 0) * (1 - ((formState.discount || 0) / 100));
  
  const renderSpecificDetails = () => {
    const targetAreaNames = treatment.targetArea?.map(key => definitions.options.targetAreas.find(o => o.key === key)?.name[language] || key).join(', ');
    const applicationName = definitions.options.applications.find(o => o.key === treatment.application)?.name[language];
    const intensityName = definitions.options.intensities.find(o => o.key === treatment.intensity)?.name[language];
    const technologyName = definitions.options.technologies.find(o => o.key === treatment.technology)?.name[language];
    
    const detailsMap: { [key: string]: string | undefined } = {
        'Area': targetAreaNames,
        'Units': treatment.units,
        'Volume': treatment.volume ? `${treatment.volume}ml` : undefined,
        'Vials': treatment.vials,
        'Dosage': treatment.dosage,
        'Apply': applicationName,
        'Intensity': intensityName,
        'Tech': technologyName || treatment.technology,
    };
    
    const details = Object.entries(detailsMap)
      .filter(([, value]) => value && value.length > 0);

    if (details.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs mt-2 pl-8">
            {details.map(([key, value]) => (
                 <span key={key} className="inline-flex items-center bg-brand-background-medium px-2.5 h-6 rounded-full">
                    <span className="font-semibold text-brand-text-primary">{key}:</span>
                    <span className="text-brand-text-body ml-1.5">{value}</span>
                </span>
            ))}
        </div>
    );
  };
  
  const renderDynamicFields = () => {
    const categoryDef = definitions.categories[formState.categoryKey];
    const currentTreatmentDef = categoryDef?.items.find(item => item.key === formState.treatmentKey);
    if (!currentTreatmentDef) return null;

    const fieldComponentMap: { [key in DynamicFieldName]: React.ReactNode } = {
      targetArea: <MultiSelectDropdown label="Target Area" options={definitions.options.targetAreas} selectedOptions={formState.targetArea || []} onChange={(selected) => handleMultiSelectChange('targetArea', selected)} language={language} />,
      units: <Input label="Units" name="units" type="number" value={formState.units || ''} onChange={handleChange} placeholder="e.g., 20" />,
      volume: <Input label="Volume (ml)" name="volume" type="number" step="0.1" value={formState.volume || ''} onChange={handleChange} placeholder="e.g., 1.0" />,
      vials: <Input label="Number of Vials" name="vials" type="number" value={formState.vials || ''} onChange={handleChange} placeholder="e.g., 2" />,
      dosage: <Input label="Dosage" name="dosage" value={formState.dosage || ''} onChange={handleChange} placeholder="e.g., 2 pumps, pea-sized" />,
      application: <Select label="Application" name="application" value={formState.application || ''} onChange={handleChange}><option value="">Select time...</option>{definitions.options.applications.map(opt => <option key={opt.key} value={opt.key}>{opt.name[language]}</option>)}</Select>,
      intensity: <Select label="Intensity" name="intensity" value={formState.intensity || ''} onChange={handleChange}><option value="">Select intensity...</option>{definitions.options.intensities.map(opt => <option key={opt.key} value={opt.key}>{opt.name[language]}</option>)}</Select>,
      technology: <Select label="Technology Used" name="technology" value={formState.technology || ''} onChange={handleChange}><option value="">Select technology...</option>{definitions.options.technologies.map(tech => <option key={tech.key} value={tech.key}>{tech.name[language]}</option>)}</Select>
    };
    
    return currentTreatmentDef.fields.map(fieldName => {
        const component = fieldComponentMap[fieldName];
        if (!component) return null;

        return React.cloneElement(component as React.ReactElement<{ wrapperClassName?: string }>, {
            key: fieldName,
            wrapperClassName: currentTreatmentDef.fields.length > 1 ? '' : 'md:col-span-2'
        });
    });
  };

  if (isEditing) {
    const categoryOptions = Object.entries(definitions.categories);
    const itemOptions = formState.categoryKey ? definitions.categories[formState.categoryKey].items : [];

    return (
      <div className="p-4 bg-white rounded-lg border border-brand-background-strong shadow-sm border-t-4 border-t-brand-primary">
        <div className="relative">
            <Input
                ref={searchInputRef}
                Icon={Search}
                placeholder="Search for a product or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                wrapperClassName="mb-2"
            />
            {searchTerm.trim() && (
                <div ref={searchResultsRef} className="absolute z-20 w-full mt-1 bg-white border border-brand-background-strong rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredTreatments.length > 0 ? (
                        <ul>
                            {filteredTreatments.map(treatment => (
                                <li
                                    key={`${treatment.categoryKey}-${treatment.key}`}
                                    className="px-4 py-3 hover:bg-brand-background-soft cursor-pointer border-b border-brand-background-medium last:border-b-0"
                                    onClick={() => handleSearchSelect(treatment.categoryKey, treatment.key)}
                                >
                                    <p className="font-medium text-brand-text-primary">{treatment.name[language]}</p>
                                    <p className="text-sm text-brand-text-secondary">{treatment.categoryName}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-sm text-brand-text-secondary">No results found.</div>
                    )}
                </div>
            )}
        </div>
        
        <div className="my-4 border-t border-brand-background-medium"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            <Select
                label="Category"
                name="categoryKey"
                value={formState.categoryKey}
                onChange={handleCategoryChange}
                wrapperClassName="md:col-span-1"
            >
                <option value="">Select a category...</option>
                {categoryOptions.map(([key, cat]) => (
                    <option key={key} value={key}>{cat.displayName[language]}</option>
                ))}
            </Select>
            <Select
                label="Product/Service"
                name="treatmentKey"
                value={formState.treatmentKey}
                onChange={handleTreatmentChange}
                disabled={!formState.categoryKey}
                wrapperClassName="md:col-span-1"
            >
                 <option value="">Select an item...</option>
                {itemOptions.map(item => (
                    <option key={item.key} value={item.key}>{item.name[language]}</option>
                ))}
            </Select>
        </div>
        
        {formState.categoryKey && formState.treatmentKey && (
          <div className="space-y-4 pt-4 mt-4 border-t border-brand-background-medium">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              {renderDynamicFields()}
              <TextArea label="Goal" name="goal" value={formState.goal} onChange={handleChange} placeholder="e.g., Reduce dynamic wrinkles..." rows={2} wrapperClassName="md:col-span-2" />
              
              <div className="md:col-span-2">
                 <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-brand-text-secondary">Key Instructions</label>
                     <Button variant="ghost" onClick={handleGenerateInstructions} disabled={isGenerating || !formState.treatmentKey || !formState.goal} className="text-xs !py-1 !px-2">
                         <SparkleIcon className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-pulse' : ''}`} />
                         {isGenerating ? 'Generating...' : 'Generate'}
                     </Button>
                 </div>
                 <TextArea name="keyInstructions" value={formState.keyInstructions} onChange={handleChange} placeholder="e.g., Avoid sun exposure..." rows={2} wrapperClassName="!mt-0" />
              </div>

              {isQuantityBased ? (
                  <>
                    <Input
                      label={`Price per ${quantityLabel} ($)`}
                      name="pricePerUnit"
                      type="number"
                      value={formState.pricePerUnit || ""}
                      onChange={handleChange}
                      placeholder="e.g., 13"
                      wrapperClassName="md:col-span-1"
                    />
                     <Input
                      label="Discount (%)"
                      name="discount"
                      type="number"
                      value={formState.discount || ""}
                      onChange={handleChange}
                      placeholder="0"
                      wrapperClassName="md:col-span-1"
                    />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-brand-text-secondary">Calculated Total Price</label>
                      <div className="mt-1 p-2 bg-brand-background-soft rounded-md text-brand-text-primary font-medium text-lg">
                        {formatCurrency(formState.price || 0)}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Input
                      label="Price ($)"
                      name="price"
                      type="number"
                      value={formState.price}
                      onChange={handleChange}
                      placeholder="150"
                      wrapperClassName="md:col-span-1"
                    />
                    <Input
                      label="Discount (%)"
                      name="discount"
                      type="number"
                      value={formState.discount || ""}
                      onChange={handleChange}
                      placeholder="0"
                      wrapperClassName="md:col-span-1"
                    />
                  </>
                )}


              <Select label="Week" name="week" value={formState.week} onChange={handleChange} wrapperClassName="">
                  <option value="">Select week...</option>
                  {definitions.options.timelines.map(opt => <option key={opt.key} value={opt.key}>{opt.name[language]}</option>)}
              </Select>
              <Select label="Frequency" name="frequency" value={formState.frequency} onChange={handleChange} Icon={CalendarIcon} wrapperClassName="">
                  <option value="">Select frequency...</option>
                  {definitions.options.frequencies.map(opt => <option key={opt.key} value={opt.key}>{opt.name[language]}</option>)}
              </Select>
            </div>
          </div>
        )}
        
        <div className="flex justify-end items-center space-x-3 mt-6">
            <Button variant="secondary" onClick={handleCancel} Icon={CancelIcon}>Cancel</Button>
            <Button 
              onClick={handleSave} 
              Icon={CheckIcon} 
              className="bg-brand-text-body text-white hover:bg-brand-text-secondary disabled:bg-brand-secondary"
              disabled={!formState.categoryKey || !formState.treatmentKey}
            >
              Save
            </Button>
        </div>
      </div>
    );
  }

  const CurrentIcon = TREATMENT_ICONS[treatment.icon]?.icon || SyringeIcon;
  const finalDisplayPrice = (treatment.price || 0) * (1 - ((treatment.discount || 0) / 100));
  const frequencyName = definitions.options.frequencies.find(o => o.key === treatment.frequency)?.name[language];

  const cardContent = (
    <div className="flex items-start space-x-3">
        <button draggable="false" className="text-brand-text-body cursor-grab pt-1 focus:outline-none">
          <DragHandleIcon className="w-5 h-5" />
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <CurrentIcon className="w-5 h-5 text-brand-primary" />
              <p className="text-brand-text-primary font-semibold">{treatmentDisplayName}</p>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setIsEditing(true)} className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-blue-50" aria-label="Edit treatment">
                <EditIcon className="h-4 w-4 text-brand-text-secondary group-hover:text-brand-primary" />
              </button>
              <button onClick={() => onRemove(treatment.id, phaseId)} className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-red-50" aria-label="Remove treatment">
                <TrashIcon className="h-4 w-4 text-brand-text-secondary group-hover:text-brand-error" />
              </button>
            </div>
          </div>
          <div className="pl-8 mt-1">
            <p className="text-brand-text-secondary text-sm">{treatment.goal}</p>
          </div>
          {renderSpecificDetails()}
          <div className="flex justify-between items-end mt-2 pl-8">
            <div className="flex items-center text-sm text-brand-text-secondary">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>{frequencyName || treatment.frequency}</span>
            </div>
            <div className="font-semibold text-md text-brand-text-primary text-right">
              {formatCurrency(finalDisplayPrice)}
              {treatment.discount && treatment.discount > 0 && (
                <span className="block text-xs text-brand-success font-normal">
                  {treatment.discount}% off
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
  );

  const draggingClass = isDragging ? 'opacity-40 shadow-lg' : '';

  if (isAnimated) {
    return (
       <div 
         draggable={!isEditing}
         onDragStart={handleDragStart}
         onDragEnd={handleDragEnd}
         data-treatment-id={treatment.id}
         className={`relative p-0.5 rounded-lg group overflow-hidden cursor-grab animate-shadow-pulse ${draggingClass}`}
       >
        <div className="absolute inset-0 bg-aurora-gradient bg-300 animate-gradient-shift animate-aurora-glow"></div>
        <div className="relative bg-white rounded-[7px] p-4">
            {cardContent}
        </div>
      </div>
    );
  }

  return (
    <div 
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-treatment-id={treatment.id}
      className={`bg-white p-4 rounded-lg border border-brand-background-medium group cursor-grab hover:shadow-md hover:border-brand-primary/20 transition-all duration-200 ${draggingClass}`}
    >
      {cardContent}
    </div>
  );
};
