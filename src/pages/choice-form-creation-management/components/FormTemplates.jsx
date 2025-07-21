import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FormTemplates = ({ onUseTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
    {
      id: 'template_001',
      name: 'Subject Selection Form',
      description: 'Standard form for staff to select subjects they wish to teach',
      category: 'subject-selection',
      fields: 8,
      estimatedTime: '5-8 minutes',
      usageCount: 45,
      lastUsed: '2024-07-15T10:30:00Z',
      preview: {
        icon: 'BookOpen',
        color: 'bg-blue-500'
      },
      features: ['Subject checkboxes', 'Workload constraints', 'Preference ranking', 'Comments section']
    },
    {
      id: 'template_002',
      name: 'Workload Preference Form',
      description: 'Collect staff preferences for teaching hours and schedule',
      category: 'workload',
      fields: 6,
      estimatedTime: '3-5 minutes',
      usageCount: 32,
      lastUsed: '2024-07-10T14:20:00Z',
      preview: {
        icon: 'Clock',
        color: 'bg-green-500'
      },
      features: ['Max hours per week', 'Preferred time slots', 'Day preferences', 'Break requirements']
    },
    {
      id: 'template_003',
      name: 'Lab Coordinator Assignment',
      description: 'Form for assigning lab coordinators and responsibilities',
      category: 'assignment',
      fields: 5,
      estimatedTime: '4-6 minutes',
      usageCount: 18,
      lastUsed: '2024-07-08T16:45:00Z',
      preview: {
        icon: 'Beaker',
        color: 'bg-purple-500'
      },
      features: ['Lab selection', 'Coordinator role', 'Equipment familiarity', 'Availability slots']
    },
    {
      id: 'template_004',
      name: 'Teaching Availability Form',
      description: 'Collect staff availability for different time slots',
      category: 'availability',
      fields: 7,
      estimatedTime: '6-10 minutes',
      usageCount: 28,
      lastUsed: '2024-07-12T11:15:00Z',
      preview: {
        icon: 'Calendar',
        color: 'bg-orange-500'
      },
      features: ['Weekly schedule grid', 'Unavailable slots', 'Preferred slots', 'Special requests']
    },
    {
      id: 'template_005',
      name: 'Course Feedback Form',
      description: 'Gather feedback from staff about course content and delivery',
      category: 'feedback',
      fields: 9,
      estimatedTime: '8-12 minutes',
      usageCount: 15,
      lastUsed: '2024-07-05T09:30:00Z',
      preview: {
        icon: 'MessageSquare',
        color: 'bg-red-500'
      },
      features: ['Rating scales', 'Text feedback', 'Improvement suggestions', 'Resource requests']
    },
    {
      id: 'template_006',
      name: 'Research Interest Survey',
      description: 'Survey to understand staff research interests and expertise',
      category: 'survey',
      fields: 10,
      estimatedTime: '10-15 minutes',
      usageCount: 12,
      lastUsed: '2024-06-28T15:20:00Z',
      preview: {
        icon: 'Search',
        color: 'bg-indigo-500'
      },
      features: ['Research areas', 'Publication details', 'Collaboration interests', 'Equipment needs']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Templates', count: templates.length },
    { value: 'subject-selection', label: 'Subject Selection', count: templates.filter(t => t.category === 'subject-selection').length },
    { value: 'workload', label: 'Workload', count: templates.filter(t => t.category === 'workload').length },
    { value: 'assignment', label: 'Assignment', count: templates.filter(t => t.category === 'assignment').length },
    { value: 'availability', label: 'Availability', count: templates.filter(t => t.category === 'availability').length },
    { value: 'feedback', label: 'Feedback', count: templates.filter(t => t.category === 'feedback').length },
    { value: 'survey', label: 'Survey', count: templates.filter(t => t.category === 'survey').length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="Layout" size={18} className="mr-2" />
            Form Templates
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Quick start with pre-built form templates
          </p>
        </div>
        
        <Button variant="outline" size="sm">
          <Icon name="Plus" size={14} className="mr-1" />
          Create Template
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
              selectedCategory === category.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            {category.label}
            <span className="ml-1 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-elevated transition-smooth">
            {/* Template Header */}
            <div className="flex items-start space-x-3 mb-4">
              <div className={`w-12 h-12 ${template.preview.color} rounded-lg flex items-center justify-center`}>
                <Icon name={template.preview.icon} size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{template.name}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Template Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">{template.fields}</p>
                <p className="text-xs text-muted-foreground">Fields</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">{template.usageCount}</p>
                <p className="text-xs text-muted-foreground">Uses</p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <p className="text-xs font-medium text-foreground mb-2">Key Features:</p>
              <div className="flex flex-wrap gap-1">
                {template.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                  >
                    {feature}
                  </span>
                ))}
                {template.features.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded">
                    +{template.features.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Template Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{template.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Icon name="Calendar" size={12} />
                  <span>Used {formatDate(template.lastUsed)}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  title="Preview Template"
                >
                  <Icon name="Eye" size={14} />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onUseTemplate(template)}
                >
                  Use Template
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-foreground mb-2">No templates found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search terms or category filter
          </p>
          <Button variant="outline">
            <Icon name="RotateCcw" size={14} className="mr-1" />
            Clear Filters
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-muted p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground">{templates.length}</p>
            <p className="text-sm text-muted-foreground">Total Templates</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {templates.reduce((sum, t) => sum + t.usageCount, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Uses</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {Math.round(templates.reduce((sum, t) => sum + t.fields, 0) / templates.length)}
            </p>
            <p className="text-sm text-muted-foreground">Avg. Fields</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {templates.filter(t => new Date(t.lastUsed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </p>
            <p className="text-sm text-muted-foreground">Used This Week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormTemplates;