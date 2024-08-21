import React from "react";

const PopUp = () => {
  return (
    <div class="bg-white box-shadow custom-card card">
      <div class="alert text-center fade show p-3">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">×</span>
        </button>
        <i class="fe fe-upload-cloud fs-50 text-success"></i>
        <h5 class="mt-2 mb-1">Success !</h5>
        <p class="mb-3 mb-3 tx-inverse">Data Upload Successfully </p>
        <a class="btn ripple btn-success" href="#">
          Continue
        </a>
      </div>
    </div>
  );
};

export default PopUp;
