import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PendingApprovalsTable = ({ pendingData, onApprove, onReject, onViewDetails }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewComment, setReviewComment] = useState('');

  const handleApprove = (request) => {
    onApprove(request.id, reviewComment);
    setSelectedRequest(null);
    setReviewComment('');
  };

  const handleReject = (request) => {
    onReject(request.id, reviewComment);
    setSelectedRequest(null);
    setReviewComment('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error bg-error/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'low':
        return 'text-success bg-success/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'under-review':
        return 'text-primary bg-primary/10';
      case 'documents-required':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pending Requests Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Applicant</th>
                <th className="text-left p-4 font-medium text-foreground">Submitted</th>
                <th className="text-left p-4 font-medium text-foreground">Priority</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Documents</th>
                <th className="text-right p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingData.map((request) => (
                <tr key={request.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={request.avatar}
                          alt={request.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{request.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{request.email}</p>
                        <p className="text-xs text-muted-foreground">{request.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{request.submittedDate}</p>
                    <p className="text-xs text-muted-foreground">{request.submittedTime}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block text-xs px-2 py-1 rounded-md font-medium capitalize ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block text-xs px-2 py-1 rounded-md font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="FileText" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{request.documentsCount} files</span>
                      {request.documentsVerified && (
                        <Icon name="CheckCircle" size={14} className="text-success" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => onViewDetails(request)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Check"
                        onClick={() => setSelectedRequest(request)}
                        className="text-success hover:text-success"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="X"
                        onClick={() => setSelectedRequest(request)}
                        className="text-error hover:text-error"
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200">
          <div className="bg-card rounded-lg border border-border max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Review Application</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => setSelectedRequest(null)}
                  className="text-muted-foreground hover:text-foreground"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={selectedRequest.avatar}
                      alt={selectedRequest.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedRequest.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="text-foreground">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Experience</p>
                    <p className="text-foreground">{selectedRequest.experience} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Qualification</p>
                    <p className="text-foreground">{selectedRequest.qualification}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Specialization</p>
                    <p className="text-foreground">{selectedRequest.specialization}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Subject Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Review Comments
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add your review comments..."
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="default"
                    iconName="Check"
                    onClick={() => handleApprove(selectedRequest)}
                    className="flex-1"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    iconName="X"
                    onClick={() => handleReject(selectedRequest)}
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovalsTable;