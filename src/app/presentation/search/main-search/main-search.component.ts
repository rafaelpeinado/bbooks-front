import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BarCodeScannerComponent } from 'src/app/views/shared/bar-code-scanner/bar-code-scanner.component';

@Component({
    selector: 'app-main-search',
    templateUrl: './main-search.component.html',
    styleUrls: ['./main-search.component.scss']
})
export class MainSearchComponent implements OnInit {
    links = ['people', 'books'];
    public formSearch: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.createForm();
    }

    redirect(): void {
        const url = this.router.url.toString();
        let subrouter = '';
        if (url.includes('people')) {
            subrouter = 'people';
        }
        if (url.includes('books')) {
            subrouter = 'books';
        }
        this.router.navigate(['search/' + subrouter], { queryParams: { search: this.formSearch.get('search').value } });
    }

    readCodeBar(): void {
        const dialogRef = this.dialog.open(BarCodeScannerComponent, {
            height: '600px',
            width: '900px'
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.formSearch.get('search').setValue(result);
                this.router.navigate(['search/books'], { queryParams: { search: result } });
            }
        });
    }

    private createForm(): void {
        this.formSearch = this.formBuilder.group({
            search: new FormControl(null)
        });
    }

}
