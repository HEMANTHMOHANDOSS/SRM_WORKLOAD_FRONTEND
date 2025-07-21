import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SubjectPool = ({ subjects, onSubjectUpdate, onSubjectSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());

  const subjectTypes = [
    { value: 'all', label: 'All Subjects' },
    { value: 'core', label: 'Core Subjects' },
    { value: 'elective', label: 'Electives' },
    { value: 'lab', label: 'Laboratory' },
    { value: 'tutorial', label: 'Tutorials' }
  ];

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || subject.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubjectSelect = (subjectId, selected) => {
    const newSelected = new Set(selectedSubjects);
    if (selected) {
      newSelected.add(subjectId);
    } else {
      newSelected.delete(subjectId);
    }
    setSelectedSubjects(newSelected);
    onSubjectSelect && onSubjectSelect(Array.from(newSelected));
  };

  const handleSelectAll = () => {
    const allIds = filteredSubjects.map(s => s.id);
    setSelectedSubjects(new Set(allIds));
    onSubjectSelect && onSubjectSelect(allIds);
  };

  const handleClearAll = () => {
    setSelectedSubjects(new Set());
    onSubjectSelect && onSubjectSelect([]);
  };

  const getSubjectTypeColor = (type) => {
    const colors = {
      'core': 'text-blue-600 bg-blue-50',
      'elective': 'text-green-600 bg-green-50',
      'lab': 'text-purple-600 bg-purple-50',
      'tutorial': 'text-orange-600 bg-orange-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const getSubjectIcon = (type) => {
    const icons = {
      'core': 'BookOpen',
      'elective': 'Star',
      'lab': 'Microscope',
      'tutorial': 'Users'
    };
    return icons[type] || 'Book';
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="BookOpen" size={18} className="mr-2" />
            Subject Pool
          </h3>
          <span className="text-sm text-muted-foreground">
            {selectedSubjects.size} of {filteredSubjects.length} selected
          </span>
        </div>

        <div className="space-y-3">
          <Input
            type="search"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            options={subjectTypes}
            value={filterType}
            onChange={setFilterType}
            placeholder="Filter by type"
          />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={filteredSubjects.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={selectedSubjects.size === 0}
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className={`
                p-3 border border-border rounded-lg transition-all duration-200 cursor-pointer
                ${selectedSubjects.has(subject.id) 
                  ? 'bg-primary/5 border-primary' :'hover:bg-muted/50'
                }
              `}
              onClick={() => handleSubjectSelect(subject.id, !selectedSubjects.has(subject.id))}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={selectedSubjects.has(subject.id)}
                  onChange={(e) => handleSubjectSelect(subject.id, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon 
                      name={getSubjectIcon(subject.type)} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                    <h4 className="font-medium text-foreground truncate">
                      {subject.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectTypeColor(subject.type)}`}>
                      {subject.type}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    Code: {subject.code} • Credits: {subject.credits}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{subject.hoursPerWeek}h/week</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Users" size={12} />
                        <span>{subject.instructor}</span>
                      </span>
                    </div>
                    
                    {subject.constraints && subject.constraints.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Icon name="AlertCircle" size={12} className="text-warning" />
                        <span>{subject.constraints.length} constraints</span>
                      </div>
                    )}
                  </div>

                  {subject.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {subject.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredSubjects.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Search" size={32} className="mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all' ?'No subjects match your filters' :'No subjects available'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Total Hours: {filteredSubjects.reduce((sum, s) => sum + s.hoursPerWeek, 0)}</span>
          <span>Selected: {Array.from(selectedSubjects).reduce((sum, id) => {
            const subject = subjects.find(s => s.id === id);
            return sum + (subject?.hoursPerWeek || 0);
          }, 0)}h</span>
        </div>
      </div>
    </div>
  );
};

export default SubjectPool;