import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DepartmentFiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock department files data
  const departmentFiles = [
    {
      id: 1,
      name: "Data Structures Syllabus 2024-25.pdf",
      category: "syllabus",
      size: "2.4 MB",
      uploadedBy: "Dr. Smith",
      uploadDate: "2025-01-15T10:30:00",
      downloads: 45,
      type: "pdf",
      description: "Complete syllabus for Data Structures course including lab components"
    },
    {
      id: 2,
      name: "Database Lab Manual.pdf",
      category: "lab-manual",
      size: "5.8 MB",
      uploadedBy: "Prof. Johnson",
      uploadDate: "2025-01-12T14:20:00",
      downloads: 32,
      type: "pdf",
      description: "Comprehensive lab manual with 12 experiments and procedures"
    },
    {
      id: 3,
      name: "Machine Learning Course Materials.zip",
      category: "materials",
      size: "15.2 MB",
      uploadedBy: "Dr. Williams",
      uploadDate: "2025-01-10T09:15:00",
      downloads: 28,
      type: "zip",
      description: "Lecture slides, assignments, and reference materials"
    },
    {
      id: 4,
      name: "Web Development Project Guidelines.docx",
      category: "guidelines",
      size: "1.1 MB",
      uploadedBy: "Prof. Brown",
      uploadDate: "2025-01-08T16:45:00",
      downloads: 67,
      type: "docx",
      description: "Project requirements, evaluation criteria, and submission guidelines"
    },
    {
      id: 5,
      name: "Software Engineering Case Studies.pdf",
      category: "materials",
      size: "8.7 MB",
      uploadedBy: "Dr. Davis",
      uploadDate: "2025-01-05T11:30:00",
      downloads: 23,
      type: "pdf",
      description: "Real-world case studies for software engineering concepts"
    },
    {
      id: 6,
      name: "Department Meeting Minutes - Dec 2024.pdf",
      category: "minutes",
      size: "0.8 MB",
      uploadedBy: "Admin Office",
      uploadDate: "2024-12-28T15:00:00",
      downloads: 15,
      type: "pdf",
      description: "Monthly department meeting minutes and action items"
    },
    {
      id: 7,
      name: "Research Paper Template.docx",
      category: "templates",
      size: "0.3 MB",
      uploadedBy: "Dr. Wilson",
      uploadDate: "2024-12-20T13:20:00",
      downloads: 89,
      type: "docx",
      description: "Standard template for research paper submissions"
    },
    {
      id: 8,
      name: "Lab Equipment Manual.pdf",
      category: "manual",
      size: "12.5 MB",
      uploadedBy: "Lab Technician",
      uploadDate: "2024-12-15T10:00:00",
      downloads: 41,
      type: "pdf",
      description: "Operating procedures and maintenance guidelines for lab equipment"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Files', count: departmentFiles.length },
    { value: 'syllabus', label: 'Syllabus', count: departmentFiles.filter(f => f.category === 'syllabus').length },
    { value: 'lab-manual', label: 'Lab Manuals', count: departmentFiles.filter(f => f.category === 'lab-manual').length },
    { value: 'materials', label: 'Course Materials', count: departmentFiles.filter(f => f.category === 'materials').length },
    { value: 'guidelines', label: 'Guidelines', count: departmentFiles.filter(f => f.category === 'guidelines').length },
    { value: 'minutes', label: 'Meeting Minutes', count: departmentFiles.filter(f => f.category === 'minutes').length },
    { value: 'templates', label: 'Templates', count: departmentFiles.filter(f => f.category === 'templates').length },
    { value: 'manual', label: 'Manuals', count: departmentFiles.filter(f => f.category === 'manual').length }
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return 'FileText';
      case 'docx':
        return 'FileText';
      case 'zip':
        return 'Archive';
      case 'xlsx':
        return 'Sheet';
      case 'pptx':
        return 'Presentation';
      default:
        return 'File';
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case 'pdf':
        return 'text-red-600';
      case 'docx':
        return 'text-blue-600';
      case 'zip':
        return 'text-yellow-600';
      case 'xlsx':
        return 'text-green-600';
      case 'pptx':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredFiles = departmentFiles
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'downloads':
          return b.downloads - a.downloads;
        case 'size':
          return parseFloat(b.size) - parseFloat(a.size);
        default:
          return 0;
      }
    });

  const handleDownload = (fileId, fileName) => {
    console.log(`Downloading file: ${fileName}`);
    // Simulate download
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (size) => {
    return size;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Department Files</h2>
          <p className="text-sm text-muted-foreground">Access syllabus, lab manuals, and course materials</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Upload"
            iconPosition="left"
            onClick={() => console.log('Upload file')}
          >
            Upload File
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name A-Z</option>
              <option value="downloads">Most Downloaded</option>
              <option value="size">File Size</option>
            </select>
          </div>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFiles.map(file => (
          <div key={file.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-elevated transition-smooth">
            <div className="flex items-start space-x-4">
              {/* File Icon */}
              <div className={`p-3 rounded-lg bg-muted ${getFileColor(file.type)}`}>
                <Icon name={getFileIcon(file.type)} size={24} />
              </div>

              {/* File Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground truncate pr-2">
                    {file.name}
                  </h3>
                  <button
                    onClick={() => handleDownload(file.id, file.name)}
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth"
                    title="Download"
                  >
                    <Icon name="Download" size={16} />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {file.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Icon name="User" size={12} />
                      <span>{file.uploadedBy}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Calendar" size={12} />
                      <span>{formatDate(file.uploadDate)}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Icon name="HardDrive" size={12} />
                      <span>{formatFileSize(file.size)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Download" size={12} />
                      <span>{file.downloads}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* File Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                file.category === 'syllabus' ? 'bg-blue-100 text-blue-800' :
                file.category === 'lab-manual' ? 'bg-green-100 text-green-800' :
                file.category === 'materials' ? 'bg-purple-100 text-purple-800' :
                file.category === 'guidelines' ? 'bg-orange-100 text-orange-800' :
                file.category === 'minutes' ? 'bg-red-100 text-red-800' :
                file.category === 'templates'? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {categories.find(c => c.value === file.category)?.label || file.category}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => console.log('Preview file:', file.id)}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth"
                  title="Preview"
                >
                  <Icon name="Eye" size={14} />
                </button>
                <button
                  onClick={() => console.log('Share file:', file.id)}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth"
                  title="Share"
                >
                  <Icon name="Share2" size={14} />
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(file.id, file.name)}
                  iconName="Download"
                  iconPosition="left"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FolderOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Files Found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'all' ?'Try adjusting your search or filter criteria.' :'No files have been uploaded to this department yet.'
            }
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* File Statistics */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">File Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{departmentFiles.length}</div>
            <div className="text-xs text-muted-foreground">Total Files</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">
              {departmentFiles.reduce((sum, file) => sum + file.downloads, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Downloads</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning">
              {(departmentFiles.reduce((sum, file) => sum + parseFloat(file.size), 0)).toFixed(1)} MB
            </div>
            <div className="text-xs text-muted-foreground">Total Size</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">
              {new Set(departmentFiles.map(file => file.uploadedBy)).size}
            </div>
            <div className="text-xs text-muted-foreground">Contributors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentFiles;