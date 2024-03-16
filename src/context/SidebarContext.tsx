import React, { createContext, useContext, useEffect, useState } from 'react';
import { SetStateType } from '@/types';

export interface SidebarContextType {

}

const defaultValue: SidebarContextType = {

};

export const SidebarContext = createContext<SidebarContextType>(defaultValue);

export const SidebarProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {


  return (
    <SidebarContext.Provider
      value={{
      }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = (): SidebarContextType => useContext(SidebarContext);
