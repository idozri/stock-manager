import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Container,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp,
  TrendingDown,
  ShowChart,
} from '@mui/icons-material';
import { MostActiveTab } from './MostActiveTab';
import { TopGainersTab } from './TopGainersTab';
import { BiggestLosersTab } from './BiggestLosersTab';
import { SearchResultsTab } from './SearchResultsTab';
import { usePortfolioActions } from '@/lib/hooks/usePortfolioActions';

const ITEMS_PER_PAGE = 12;

export const MarketDataSection: React.FC = () => {
  const {
    handleAddToPortfolio,
    handleRemoveFromPortfolio,
    isStockInPortfolio,
  } = usePortfolioActions();

  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setCurrentPage(1); // Reset pagination when changing tabs
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset pagination when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // If user is searching, show search results instead of tabs
  const isSearching = searchQuery.length > 2;

  return (
    <Container maxWidth="xl">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Market Overview
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search stocks... (type at least 3 characters)"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600 }}
          />
        </Box>

        {/* Show tabs only when not searching */}
        {!isSearching && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="market data tabs"
            >
              <Tab
                icon={<ShowChart />}
                label="Most Active"
                id="market-tab-0"
                aria-controls="market-tabpanel-0"
              />
              <Tab
                icon={<TrendingUp />}
                label="Top Gainers"
                id="market-tab-1"
                aria-controls="market-tabpanel-1"
              />
              <Tab
                icon={<TrendingDown />}
                label="Biggest Losers"
                id="market-tab-2"
                aria-controls="market-tabpanel-2"
              />
            </Tabs>
          </Box>
        )}

        {/* Render appropriate tab content */}
        {isSearching ? (
          <SearchResultsTab
            searchQuery={searchQuery}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onAddToPortfolio={handleAddToPortfolio}
            onRemoveFromPortfolio={handleRemoveFromPortfolio}
            isStockInPortfolio={isStockInPortfolio}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        ) : (
          <Box>
            {/* Most Active Tab */}
            <Box hidden={selectedTab !== 0}>
              <MostActiveTab
                isActive={selectedTab === 0}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onAddToPortfolio={handleAddToPortfolio}
                onRemoveFromPortfolio={handleRemoveFromPortfolio}
                isStockInPortfolio={isStockInPortfolio}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </Box>

            {/* Top Gainers Tab */}
            <Box hidden={selectedTab !== 1}>
              <TopGainersTab
                isActive={selectedTab === 1}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onAddToPortfolio={handleAddToPortfolio}
                onRemoveFromPortfolio={handleRemoveFromPortfolio}
                isStockInPortfolio={isStockInPortfolio}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </Box>

            {/* Biggest Losers Tab */}
            <Box hidden={selectedTab !== 2}>
              <BiggestLosersTab
                isActive={selectedTab === 2}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onAddToPortfolio={handleAddToPortfolio}
                onRemoveFromPortfolio={handleRemoveFromPortfolio}
                isStockInPortfolio={isStockInPortfolio}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};
