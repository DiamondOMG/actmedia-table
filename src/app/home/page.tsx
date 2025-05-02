"use client"
import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  MoreVert as MoreVertIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Close as CloseIcon,
  Star as StarIcon,
  EmojiObjects as EmojiObjectsIcon,
  Computer as ComputerIcon,
  PlayArrow as PlayArrowIcon,
  CalendarToday as CalendarTodayIcon,
  Description as DescriptionIcon,
  Storage as StorageIcon,
  BarChart as BarChartIcon,
  TouchApp as TouchAppIcon,
  Tv as TvIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';

const ActMediaCMS: React.FC = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Mock data for recent projects
  const recentProjects = [
    {
      id: 1,
      title: 'Digital Media Planner',
      type: 'Base',
      icon: <TvIcon />,
      color: 'bg-cyan-500',
      date: 'Today'
    },
    {
      id: 2,
      title: 'Bookings',
      type: 'Interface - Digital Media Planner',
      icon: <CalendarTodayIcon />,
      color: 'bg-cyan-500',
      date: 'Past 30 days'
    },
    {
      id: 3,
      title: 'Requests',
      type: 'Interface - Digital Media Planner',
      icon: <CampaignIcon />,
      color: 'bg-cyan-500',
      date: 'Past 30 days'
    },
    {
      id: 4,
      title: 'OMG Digital - Asset Management',
      type: 'Base',
      icon: <DescriptionIcon />,
      color: 'bg-cyan-500',
      date: 'Earlier'
    },
    {
      id: 5,
      title: 'TargetR - Monitored devices',
      type: 'Base',
      icon: <StorageIcon />,
      color: 'bg-green-600',
      date: 'Earlier'
    }
  ];

  // Group projects by date
  const groupedProjects = recentProjects.reduce((groups, project) => {
    if (!groups[project.date]) {
      groups[project.date] = [];
    }
    groups[project.date].push(project);
    return groups;
  }, {} as Record<string, typeof recentProjects>);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 flex items-center">
          <IconButton size="small" edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <div className="ml-3 flex items-center">
            <Typography component="span" className="text-blue-600 font-bold text-xl">
              Act
            </Typography>
            <Typography component="span" className="text-blue-400 font-bold text-xl">
              Media
            </Typography>
          </div>
        </div>
        
        <Divider />
        
        <div className="flex flex-col flex-grow overflow-y-auto">
          <List component="nav" className="pt-1">
            <ListItem component="div" className="bg-gray-100">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
              <KeyboardArrowDownIcon fontSize="small" />
            </ListItem>
            
            <div className="px-4 py-3">
              <Box className="flex items-center mb-1">
                <StarIcon fontSize="small" className="text-gray-400 mr-2" />
                <Typography variant="body2" className="text-gray-500 text-sm">
                  Your starred bases, interfaces, and workspaces will appear here
                </Typography>
              </Box>
            </div>
            
            <ListItem component="div" className="flex justify-between">
              <ListItemText primary="All workspaces" />
              <div className="flex">
                <IconButton size="small">
                  <AddIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <KeyboardArrowDownIcon fontSize="small" />
                </IconButton>
              </div>
            </ListItem>
          </List>
          
          <div className="mt-auto">
            <List>
              <ListItem component="div">
                <ListItemIcon>
                  <GridViewIcon />
                </ListItemIcon>
                <ListItemText primary="Templates and apps" />
              </ListItem>
              <ListItem component="div">
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Marketplace" />
              </ListItem>
              <ListItem component="div">
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Import" />
              </ListItem>
            </List>
            
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              className="mx-4 mb-4 bg-blue-600 hover:bg-blue-700"
              fullWidth
            >
              Create
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top AppBar */}
        <AppBar position="static" color="default" elevation={0} className="border-b border-gray-200 bg-white">
          <Toolbar>
            <Typography variant="h6" className="text-gray-800 font-medium flex-grow">
              Home
            </Typography>
            
            <div className="flex items-center">
              <TextField
                placeholder="Search..."
                size="small"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" className="text-gray-500" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="caption" className="text-gray-400">
                        ctrl K
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                className="w-72 mr-4"
              />
              
              <Tooltip title="Help">
                <IconButton>
                  <HelpIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Notifications">
                <IconButton>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              
              <Avatar className="bg-orange-600 ml-2 cursor-pointer">
                AM
              </Avatar>
            </div>
          </Toolbar>
        </AppBar>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <Typography variant="h5" className="font-bold mb-6">
            Home
          </Typography>
          
          {/* Upgrade Banner */}
          <Paper className="mb-8 bg-blue-50 relative overflow-hidden">
            <IconButton 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            
            <Box className="p-4 flex items-center">
              <div className="flex-grow">
                <Typography variant="h6" className="font-bold mb-1">
                  Unlock more power on the Team plan
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  More records. More automations. More customization. More ActMedia.
                </Typography>
                
                <div className="flex mt-3">
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<PlayArrowIcon />}
                    className="bg-gray-800 hover:bg-gray-900 mr-4"
                  >
                    Upgrade
                  </Button>
                  <Button 
                    variant="text" 
                    size="small"
                    className="text-gray-600"
                  >
                    Compare plans
                  </Button>
                </div>
              </div>
              
              <img 
                src="/api/placeholder/300/150" 
                alt="Upgrade illustration" 
                className="h-32 w-auto"
              />
            </Box>
          </Paper>
          
          {/* Quick Start Options */}
          <Grid container spacing={3} className="mb-8">
            <Grid item xs={12} sm={6} md={3}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="h-full flex flex-col">
                  <div className="mb-3 text-violet-600">
                    <EmojiObjectsIcon />
                  </div>
                  <Typography variant="h6" className="font-medium mb-2">
                    Start with AI
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 flex-grow">
                    Turn your process into an app with data and interfaces using AI.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="h-full flex flex-col">
                  <div className="mb-3 text-blue-600">
                    <ComputerIcon />
                  </div>
                  <Typography variant="h6" className="font-medium mb-2">
                    Start with templates
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 flex-grow">
                    Select a template to get started and customize as you go.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="h-full flex flex-col">
                  <div className="mb-3 text-green-600">
                    <TouchAppIcon />
                  </div>
                  <Typography variant="h6" className="font-medium mb-2">
                    Quickly upload
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 flex-grow">
                    Easily migrate your existing projects in just a few minutes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="h-full flex flex-col">
                  <div className="mb-3 text-blue-600">
                    <BarChartIcon />
                  </div>
                  <Typography variant="h6" className="font-medium mb-2">
                    Start from scratch
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 flex-grow">
                    Create a new blank base with custom tables, fields, and views.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Recent Projects */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Typography variant="body1" className="mr-2">
                  Opened by you
                </Typography>
                <KeyboardArrowDownIcon fontSize="small" className="text-gray-500" />
                
                <Typography variant="body1" className="mx-3">
                  Show all types
                </Typography>
                <KeyboardArrowDownIcon fontSize="small" className="text-gray-500" />
              </div>
              
              <div className="flex">
                <IconButton 
                  size="small" 
                  onClick={() => setViewType('list')}
                  color={viewType === 'list' ? 'primary' : 'default'}
                >
                  <ViewListIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => setViewType('grid')}
                  color={viewType === 'grid' ? 'primary' : 'default'}
                >
                  <GridViewIcon />
                </IconButton>
              </div>
            </div>
            
            {/* Projects List */}
            {Object.entries(groupedProjects).map(([date, projects]) => (
              <div key={date} className="mb-6">
                <Typography variant="body1" className="font-medium mb-2">
                  {date}
                </Typography>
                
                <Grid container spacing={3}>
                  {projects.map(project => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-md ${project.color} text-white mr-3`}>
                              {project.icon}
                            </div>
                            <div className="flex-grow">
                              <Typography variant="subtitle1" className="font-medium">
                                {project.title}
                              </Typography>
                              <Typography variant="body2" className="text-gray-500">
                                {project.type}
                              </Typography>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActMediaCMS;