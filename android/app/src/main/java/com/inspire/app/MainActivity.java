package com.inspire.app;

import com.getcapacitor.BridgeActivity;
import com.google.android.gms.cast.framework.CastContext;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // capacitor video player
    CastContext.getSharedInstance(this);
  }
}
