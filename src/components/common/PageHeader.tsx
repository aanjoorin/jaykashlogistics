import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: {
    name: string;
    path: string;
  }[];
  backgroundImage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  breadcrumbs,
  backgroundImage = "https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
}) => {
  return (
    <div className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: `url('${backgroundImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-primary bg-opacity-80"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom relative z-10">
        {breadcrumbs && (
          <div className="flex items-center space-x-2 text-sm text-white mb-6">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="h-4 w-4 text-white opacity-70" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-accent">{item.name}</span>
                ) : (
                  <Link 
                    to={item.path} 
                    className="hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        {subtitle && <p className="text-lg text-slate-200 max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHeader;