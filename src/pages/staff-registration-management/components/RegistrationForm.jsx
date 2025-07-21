import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const RegistrationForm = ({ onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    
    // Academic Qualifications
    highestQualification: '',
    university: '',
    graduationYear: '',
    specialization: '',
    experience: '',
    previousInstitution: '',
    
    // Subject Expertise
    subjects: [],
    preferredSubjects: [],
    labExpertise: [],
    researchAreas: '',
    
    // Documents
    resume: null,
    certificates: null,
    experienceLetter: null,
    idProof: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Personal Information', icon: 'User' },
    { id: 2, title: 'Academic Qualifications', icon: 'GraduationCap' },
    { id: 3, title: 'Subject Expertise', icon: 'BookOpen' },
    { id: 4, title: 'Documents Upload', icon: 'Upload' }
  ];

  const availableSubjects = [
    "Mathematics", "Physics", "Chemistry", "Computer Science", "Electronics",
    "Mechanical Engineering", "Civil Engineering", "Electrical Engineering",
    "Information Technology", "Data Structures", "Algorithms", "Database Systems",
    "Software Engineering", "Web Development", "Machine Learning", "Artificial Intelligence"
  ];

  const labExpertiseOptions = [
    "Computer Lab", "Physics Lab", "Chemistry Lab", "Electronics Lab",
    "Mechanical Workshop", "Civil Lab", "Electrical Lab", "Research Lab"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubjectChange = (subject, checked) => {
    setFormData(prev => ({
      ...prev,
      subjects: checked 
        ? [...prev.subjects, subject]
        : prev.subjects.filter(s => s !== subject)
    }));
  };

  const handleLabExpertiseChange = (lab, checked) => {
    setFormData(prev => ({
      ...prev,
      labExpertise: checked 
        ? [...prev.labExpertise, lab]
        : prev.labExpertise.filter(l => l !== lab)
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        break;
      case 2:
        if (!formData.highestQualification) newErrors.highestQualification = 'Qualification is required';
        if (!formData.university) newErrors.university = 'University is required';
        if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
        if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        break;
      case 3:
        if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject must be selected';
        break;
      case 4:
        if (!formData.resume) newErrors.resume = 'Resume is required';
        if (!formData.certificates) newErrors.certificates = 'Certificates are required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
                required
              />
              <Input
                label="Gender"
                type="text"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                placeholder="Male/Female/Other"
              />
            </div>
            
            <Input
              label="Address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Complete address"
            />
            
            <Input
              label="Emergency Contact"
              type="tel"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              placeholder="Emergency contact number"
            />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Highest Qualification"
                type="text"
                value={formData.highestQualification}
                onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                error={errors.highestQualification}
                placeholder="Ph.D, M.Tech, M.Sc, etc."
                required
              />
              <Input
                label="University/Institution"
                type="text"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                error={errors.university}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Graduation Year"
                type="number"
                value={formData.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                error={errors.graduationYear}
                required
              />
              <Input
                label="Specialization"
                type="text"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                error={errors.specialization}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Years of Experience"
                type="number"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="0"
              />
              <Input
                label="Previous Institution"
                type="text"
                value={formData.previousInstitution}
                onChange={(e) => handleInputChange('previousInstitution', e.target.value)}
                placeholder="If applicable"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Subject Expertise <span className="text-error">*</span>
              </label>
              {errors.subjects && (
                <p className="text-sm text-error mb-2">{errors.subjects}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSubjects.map((subject) => (
                  <Checkbox
                    key={subject}
                    label={subject}
                    checked={formData.subjects.includes(subject)}
                    onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Lab Expertise
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {labExpertiseOptions.map((lab) => (
                  <Checkbox
                    key={lab}
                    label={lab}
                    checked={formData.labExpertise.includes(lab)}
                    onChange={(e) => handleLabExpertiseChange(lab, e.target.checked)}
                  />
                ))}
              </div>
            </div>
            
            <Input
              label="Research Areas"
              type="text"
              value={formData.researchAreas}
              onChange={(e) => handleInputChange('researchAreas', e.target.value)}
              placeholder="Comma-separated research interests"
            />
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Resume/CV <span className="text-error">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload('resume', e.target.files[0])}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {errors.resume && (
                  <p className="text-sm text-error mt-1">{errors.resume}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Educational Certificates <span className="text-error">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => handleFileUpload('certificates', e.target.files)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {errors.certificates && (
                  <p className="text-sm text-error mt-1">{errors.certificates}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Experience Letter
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload('experienceLetter', e.target.files[0])}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ID Proof
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('idProof', e.target.files[0])}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Progress Steps */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-smooth ${
                currentStep >= step.id 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-border text-muted-foreground'
              }`}>
                {currentStep > step.id ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step.icon} size={16} />
                )}
              </div>
              <div className="ml-3 hidden md:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {steps[currentStep - 1].title}
          </h3>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                iconName="ChevronLeft"
                iconPosition="left"
                onClick={handlePrevious}
              >
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              onClick={onCancel}
            >
              Cancel
            </Button>
            
            {currentStep < 4 ? (
              <Button
                variant="default"
                iconName="ChevronRight"
                iconPosition="right"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="default"
                iconName="UserPlus"
                iconPosition="left"
                onClick={handleSubmit}
                loading={isSubmitting}
              >
                Register Staff
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;